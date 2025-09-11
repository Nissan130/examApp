def init_app(app):
    """
    Register all blueprints from subfolders of routes.
    """
    # Import authRoutes init_app and call it
    from .authRoutes import init_app as auth_routes
    from .examinerRoutes import init_app as examiner_routes
    auth_routes(app)
    examiner_routes(app)
    

    # Example for future subfolders
    # from .examineeRoutes import init_app as examinee_routes
    # examinee_routes(app)

    # from .examinerRoutes import init_app as examiner_routes
    # examiner_routes(app)
