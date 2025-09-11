def init_app(app):
    """
    Register all blueprints from subfolders.
    """
    from .userRoutes import  auth_bp
    # app.register_blueprint(user_bp)
    app.register_blueprint(auth_bp)


    # from .examineeRoutes.examineeRoutes import examinee_bp
    # app.register_blueprint(examinee_bp)

    # from .examinerRoutes.examinerRoutes import examiner_bp
    # app.register_blueprint(examiner_bp)
