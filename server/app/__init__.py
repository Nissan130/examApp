from flask import Flask
from flask_migrate import Migrate
from app.config import Config
from app.models import db

migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    from app.routes import init_app as register_routes
    register_routes(app)
    
    @app.route('/')
    def hello():
        return 'Welcome to ExamApp API! Server is running.'
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Server is running'}
    
    @app.shell_context_processor
    def make_shell_context():
        from app.models import User
        return {
            'db': db,
            'User': User
        }
    
    return app