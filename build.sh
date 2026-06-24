#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
u = '$DJANGO_SU_NAME'
e = '$DJANGO_SU_EMAIL'
p = '$DJANGO_SU_PASS'
if not User.objects.filter(username=u).exists():
    User.objects.create_superuser(u, e, p)
"
