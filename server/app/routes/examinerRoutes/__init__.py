# app/routes/examinerRoutes/__init__.py
def init_app(app):
    """
    Register all blueprints in the examinerRoutes folder.
    """
    from .createExamRoutes import create_exam_bp
    from .allCreatedExamRoute import all_created_exam_bp

    app.register_blueprint(create_exam_bp)
    app.register_blueprint(all_created_exam_bp)
