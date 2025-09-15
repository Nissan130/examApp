from app import create_app

app = create_app()

if __name__ == '__main__':
    # Run Flask server with debug enabled
    app.run()
