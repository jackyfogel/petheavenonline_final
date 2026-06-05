from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .forms import RegisterForm
from config.views import _email_subject


def _safe_next(url):
    if url and url.startswith('/') and not url.startswith('//'):
        return url
    return ''


def register_view(request):
    if request.user.is_authenticated:
        return redirect('/')
    if request.method == 'POST':
        next_url = _safe_next(request.POST.get('next', ''))
        form = RegisterForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            full_name = form.cleaned_data['full_name'].strip()
            parts = full_name.split(' ', 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ''
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            try:
                plain = (
                    f"Hi {first_name},\n\n"
                    "Welcome to PetHeavenOnline.\n\n"
                    "Your account has been created successfully.\n\n"
                    "You can now create lasting memorials for your beloved pets. "
                    "Visit petheavenonline.com/create to get started.\n\n"
                    "With warmth,\n"
                    "The PetHeavenOnline Team"
                )
                html = (
                    '<div style="font-family:Arial,sans-serif;max-width:600px;color:#2e2640;">'
                    f'<p>Hi {first_name},</p>'
                    '<p>Welcome to PetHeavenOnline.</p>'
                    '<p>Your account has been created successfully.</p>'
                    '<p>You can now create lasting memorials for your beloved pets. Visit '
                    '<a href="https://petheavenonline.com/create/" style="color:#9a89b5;">'
                    'petheavenonline.com/create</a> to get started.</p>'
                    '<p>With warmth,<br>The PetHeavenOnline Team</p>'
                    '</div>'
                )
                send_mail(
                    subject=_email_subject('🐾 Welcome to PetHeavenOnline!'),
                    message=plain,
                    html_message=html,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Welcome email error: {e}")

            return redirect(next_url or '/welcome/')
    else:
        next_url = _safe_next(request.GET.get('next', ''))
        form = RegisterForm()
    return render(request, 'accounts/register.html', {'form': form, 'next': next_url})


def login_view(request):
    if request.user.is_authenticated:
        return redirect('/')
    error = None
    if request.method == 'POST':
        next_url = _safe_next(request.POST.get('next', ''))
        email = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return redirect(next_url or '/')
        else:
            error = "Invalid email or password."
    else:
        next_url = _safe_next(request.GET.get('next', ''))
    return render(request, 'accounts/login.html', {'error': error, 'next': next_url})


def logout_view(request):
    logout(request)
    return redirect('/')


def welcome_view(request):
    return render(request, 'accounts/welcome.html')
