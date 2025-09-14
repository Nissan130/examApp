from app import create_app
from app.config import get_config

app = create_app(get_config())

if __name__ == "__main__":
    app.run(debug=True)
