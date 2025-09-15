from flask import Flask
from flask_migrate import Migrate
from .config import Config
from .models import db
from flask_cors import CORS
import os

migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS
    if app.config['ENV'] == 'development':
        CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})
    else:
        # Allow all origins in production or specify your frontend URL
        CORS(app, resources={r"/*": {"origins": "*"}})

    # Initialize database and migrations
    db.init_app(app)
    migrate.init_app(app, db)

    # Initialize migrations directory if it doesn't exist
    with app.app_context():
        migrations_dir = os.path.join(os.path.dirname(__file__), '..', 'migrations')
        if not os.path.exists(migrations_dir):
            from flask_migrate import init
            print("Initializing migrations directory...")
            init()
            
        # Run migrations
        from flask_migrate import upgrade
        try:
            upgrade()
        except Exception as e:
            print(f"Migration error: {e}")
            # If there's an error, try to migrate instead
            try:
                from flask_migrate import migrate as migrate_cmd
                migrate_cmd()
                upgrade()
            except Exception as e2:
                print(f"Secondary migration error: {e2}")

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
        from .models import User, Exam, Question, ExamineeAttemptExamResult, ExamineeAttemptQuestions
        return {
            'db': db,
            'User': User,
            'Exam': Exam,
            'Question': Question,
            'ExamineeAttemptExamResult': ExamineeAttemptExamResult,
            'ExamineeAttemptQuestions': ExamineeAttemptQuestions
        }

    return app