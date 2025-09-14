import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
    DEBUG = os.getenv("FLASK_DEBUG", "0").lower() in ("true", "1", "t")

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD', '')}"
        f"@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', 5432)}/{os.getenv('DB_NAME')}"
    )

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)

def get_config():
    env = os.getenv("FLASK_ENV", "development")
    return ProductionConfig if env == "production" else DevelopmentConfig
