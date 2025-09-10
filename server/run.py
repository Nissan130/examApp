from app import create_app

# Create Flask app instance using factory
app = create_app()

if __name__ == '__main__':
    # Run Flask server with debug enabled
    app.run(debug=True)
