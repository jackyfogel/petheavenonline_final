#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
echo "from django.contrib.auth.models import User; u=User.objects.filter(is_superuser=True).first(); u.set_password('12341234'); u.save(); print(f'Reset password for {u.username}')" | python manage.py shell