# app/routes/examineRoutes/__init__.py
def init_app(app):
    """
    Register all blueprints in the examinerRoutes folder.
    """
    from .joinExamRoute import enter_exam_code_bp
    from .ExamineeAttemptExamsRoute import examinee_attempt_exams_bp
    from .previousAttemptExamRoute import examinee_previous_attempt_exam_bp

    app.register_blueprint(enter_exam_code_bp)
    app.register_blueprint(examinee_attempt_exams_bp)
    app.register_blueprint(examinee_previous_attempt_exam_bp)

