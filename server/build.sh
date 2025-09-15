#!/usr/bin/env bash
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create migrations folder if not exists
if [ ! -d "migrations" ]; then
  flask db init
fi

# Run migrations
flask db migrate -m "Initial migration" || true
flask db upgrade
