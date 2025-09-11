from flask import Blueprint, request, jsonify
from app.models import User, db
from app.utils.jwt_utils import generate_jwt, decode_jwt
from functools import wraps

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')





import uuid


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        # Decode token
        payload = decode_jwt(token)
        if not payload:
            return jsonify({'message': 'Token is invalid or expired!'}), 401
        
        # Get user from database
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'message': 'User not found!'}), 401
        
        return f(user, *args, **kwargs)
    
    return decorated


# ----------------------------
# GET all users
# ----------------------------
@auth_bp.route('/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        users_list = [u.to_dict() for u in users]
        return jsonify({'users': users_list, 'count': len(users_list)})
    except Exception as e:
        return jsonify({'error': 'Failed to fetch users', 'details': str(e)}), 500


# ----------------------------
# Register User
# ----------------------------
@auth_bp.route('/register', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password', 'defaultpassword')

    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User with this email already exists'}), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created successfully', 'user': user.to_dict()}), 201


# ----------------------------
# Login
# ----------------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not user.check_password(password):
        return jsonify({'error': 'Invalid password'}), 401

    # Convert UUID to string for JWT
    token = generate_jwt(str(user.id))

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200
