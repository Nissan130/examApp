import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Render provides DATABASE_URL in production
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    
    # Fix for SQLAlchemy 1.4+ and PostgreSQL on Render
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
    DEBUG = os.getenv("FLASK_DEBUG", False)