#!/bin/bash
set -e

echo "Running database migrations with Alembic..."
alembic upgrade head

echo "Starting application server..."
exec gunicorn -b 0.0.0.0:5000 -w 2 "run:app"
