#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
npm install
npm run build
python manage.py collectstatic --no-input
python manage.py migrate
echo "from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'jackyfoge@gmail.com', 'daniel25')" | python manage.py shell
