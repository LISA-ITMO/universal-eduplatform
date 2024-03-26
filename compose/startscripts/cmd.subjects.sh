#!/bin/bash
python manage.py makemigrations --no-input
python manage.py migrate --no-input
python manage.py collectstatic --noinput
gunicorn --bind 0.0.0.0:9000 project.wsgi