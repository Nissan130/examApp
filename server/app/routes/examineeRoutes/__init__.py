# app/routes/examineRoutes/__init__.py
def init_app(app):
    """
    Register all blueprints in the examinerRoutes folder.
    """
    from .joinExamRoute import enter_exam_code_bp
    from .attemptExamResultRoute import examinee_attempt_exam_result_bp

    app.register_blueprint(enter_exam_code_bp)
    app.register_blueprint(examinee_attempt_exam_result_bp)

