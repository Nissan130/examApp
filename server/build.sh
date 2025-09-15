#!/usr/bin/env bash
# Exit on error
set -o errexit

# Create a virtual environment (Render automatically handles this but explicit is good)
python -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# If you have any database migrations, run them
# Make sure you have a FLASK_APP set or specify the app directly
export FLASK_APP=app:create_app
python -m flask db upgrade