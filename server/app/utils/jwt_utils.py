import jwt
from datetime import datetime, timedelta
from flask import current_app
import logging

# Set up logging
logger = logging.getLogger(__name__)

def generate_jwt(user_id, expires_in=2592000):
    try:
        # Ensure user_id is a string
        user_id_str = str(user_id)
        
        payload = {
            "user_id": user_id_str,
            "exp": datetime.utcnow() + timedelta(seconds=expires_in),
            "iat": datetime.utcnow()  # Issued at time
        }
        
        # Debug: Check if secret key is set
        secret_key = current_app.config.get('SECRET_KEY')
        if not secret_key:
            logger.error("SECRET_KEY is not configured in app config")
            raise ValueError("SECRET_KEY is not configured")
            
        token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        # For debugging: log the generated token
        logger.debug(f"Generated token for user_id: {user_id_str}")
        
        return token
        
    except Exception as e:
        logger.error(f"Error generating JWT: {str(e)}")
        raise

def decode_jwt(token):
    try:
        # Debug: Check if secret key is set
        secret_key = current_app.config.get('SECRET_KEY')
        if not secret_key:
            logger.error("SECRET_KEY is not configured in app config")
            return None
            
        # Debug: Log the token being decoded
        logger.debug(f"Attempting to decode token: {token}")
        
        payload = jwt.decode(
            token, 
            secret_key, 
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        
        logger.debug(f"Successfully decoded token payload: {payload}")
        return payload
        
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token has expired")
        return None
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid JWT token: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error decoding JWT: {str(e)}")
        return None