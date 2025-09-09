from flask import Blueprint, request, jsonify
from app.models import User, db

user_bp = Blueprint('users', __name__, url_prefix='/api/users')

@user_bp.route('/', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        users_list = [{
            'id': user.id,
            'name': user.username,
            'email': user.email
        } for user in users]
        
        return jsonify({
            'users': users_list,
            'count': len(users_list)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch users'}), 500

@user_bp.route('/', methods=['POST'])
def create_user():
    try:
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
        
        if User.query.filter_by(username=name).first():
            return jsonify({'error': 'User with this name already exists'}), 409
        
        user = User(username=name, email=email)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'name': user.username,
                'email': user.email
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create user'}), 500

@user_bp.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({'message': 'User routes are working!'})