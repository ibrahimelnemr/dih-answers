#!/bin/bash
set -e

echo "Running migrations..."
poetry run python manage.py migrate --noinput

echo "Checking for admin user..."
poetry run python manage.py initadmin

exec "$@"
