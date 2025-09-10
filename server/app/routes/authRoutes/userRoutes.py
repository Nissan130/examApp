from flask import Blueprint, request, jsonify
from app.models import User, db
from app.utils.jwt_utils import generate_jwt


user_bp = Blueprint('users', __name__, url_prefix='/api/users')

@user_bp.route('/', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        users_list = [u.to_dict() for u in users]
        return jsonify({'users': users_list, 'count': len(users_list)})
    except Exception:
        return jsonify({'error': 'Failed to fetch users'}), 500

# ========== Register Route ========
@user_bp.route('/', methods=['POST'])
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


# ========= Login Route ========
login_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@login_bp.route('/login', methods=['POST'])
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

    # JWT generate করো
    token = generate_jwt(user.id)

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200


from functools import wraps
from flask import request, jsonify
from app.utils.jwt_utils import decode_jwt
from app.models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        payload = decode_jwt(token)
        if not payload:
            return jsonify({'error': 'Token is invalid or expired'}), 401

        # Optional: set current_user
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return f(user, *args, **kwargs)
    return decorated
