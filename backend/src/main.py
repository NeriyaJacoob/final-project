"""Entry point for running the Flask backend as a standalone script."""

from api import app

if __name__ == "__main__":
    app.run(debug=False, use_reloader=False)
