from flask import Flask
from flask_migrate import Migrate
from .config import Config
from .models import db
from flask_cors import CORS


migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for all routes
    CORS(app, resources={r"/*": {"origins": "*"}})


    # Initialize database and migrations
    db.init_app(app)
    migrate.init_app(app, db)

    # Register all routes from subfolders
    from .routes import init_app as register_routes
    register_routes(app)

    # Simple root endpoint
    @app.route('/')
    def hello():
        return 'Welcome to ExamApp API! Server is running.'

    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Server is running'}

    # Shell context for flask shell
    @app.shell_context_processor
    def make_shell_context():
        from .models import User
        return {'db': db, 'User': User}

    return app
