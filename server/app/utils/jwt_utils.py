import jwt
from datetime import datetime, timedelta
from flask import current_app

def generate_jwt(user_id, expires_in=3600):
    """
    Generate JWT token for a user.
    expires_in: token expiry time in seconds (default 1 hour)
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(seconds=expires_in)
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm="HS256")
    return token

def decode_jwt(token):
    """
    Decode JWT token and return payload
    """
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
