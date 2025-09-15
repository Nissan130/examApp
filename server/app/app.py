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

    # -------------------------------
    # Enable CORS based on environment
    # -------------------------------
    env = os.getenv("FLASK_ENV", "development")
    if env == "development":
        # Allow React dev server on localhost:5173
        CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})
    else:
        # Production: allow deployed frontend domain (replace with your Render frontend URL)
        CORS(app, resources={r"/*": {"origins": ["https://exam-app-server.onrender.com"]}})


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