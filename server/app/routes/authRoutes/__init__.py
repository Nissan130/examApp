def init_app(app):
    """
    Register all blueprints from subfolders.
    """
    from .userRoutes import user_bp, login_bp
    app.register_blueprint(user_bp)
    app.register_blueprint(login_bp)


    # from .examineeRoutes.examineeRoutes import examinee_bp
    # app.register_blueprint(examinee_bp)

    # from .examinerRoutes.examinerRoutes import examiner_bp
    # app.register_blueprint(examiner_bp)
