from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from .forms import RegisterForm
from config.views import _email_subject, _base_url, _verify_turnstile


def _safe_next(url):
    if url and url.startswith('/') and not url.startswith('//'):
        return url
    return ''


def register_view(request):
    if request.user.is_authenticated:
        return redirect('/')
    if request.method == 'POST':
        next_url = _safe_next(request.POST.get('next', ''))
        if request.POST.get('website', ''):
            return redirect(next_url or '/welcome/')
        try:
            import time as _time
            elapsed = _time.time() - int(request.POST.get('form_time', 0)) / 1000
            if elapsed < 3:
                return redirect(next_url or '/welcome/')
        except (ValueError, TypeError):
            pass
        remote_ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))
        if not _verify_turnstile(request.POST.get('cf-turnstile-response'), remote_ip):
            return redirect(next_url or '/welcome/')
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
                    f'<a href="{_base_url()}/create/" style="color:#9a89b5;">'
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

            try:
                from django.utils import timezone
                registered_at = timezone.now().strftime('%Y-%m-%d %H:%M UTC')
                admin_plain = (
                    f"A new user has registered.\n\n"
                    f"Name: {full_name}\n"
                    f"Email: {email}\n"
                    f"Registered: {registered_at}"
                )
                admin_html = (
                    '<div style="font-family:Arial,sans-serif;max-width:600px;color:#2e2640;">'
                    '<p>A new user has registered.</p>'
                    f'<p><strong>Name:</strong> {full_name}<br>'
                    f'<strong>Email:</strong> {email}<br>'
                    f'<strong>Registered:</strong> {registered_at}</p>'
                    '</div>'
                )
                admin_msg = EmailMultiAlternatives(
                    subject=_email_subject(f'New user registered: {full_name}'),
                    body=admin_plain,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=['admin@petheavenonline.com'],
                    cc=['jackyfogel@gmail.com'],
                )
                admin_msg.attach_alternative(admin_html, 'text/html')
                admin_msg.send()
            except Exception as e:
                print(f"Registration admin notification error: {e}")

            return redirect(next_url or '/welcome/')
    else:
        next_url = _safe_next(request.GET.get('next', ''))
        form = RegisterForm()
    return render(request, 'accounts/register.html', {'form': form, 'next': next_url, 'TURNSTILE_SITE_KEY': settings.TURNSTILE_SITE_KEY})


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


@login_required(login_url='/login/')
def delete_account_view(request):
    if request.method == 'POST':
        if request.POST.get('confirmation') != 'DELETE':
            return render(request, 'accounts/delete_account.html', {'error': 'Please type DELETE to confirm.'})
        user = request.user
        saved_email = user.email
        saved_first = user.first_name or (user.get_full_name().split()[0] if user.get_full_name() else user.username)

        try:
            plain = (
                f"Hi {saved_first},\n\n"
                "Your account and all associated memorials have been permanently deleted as requested.\n\n"
                "We're sorry to see you go. If you ever want to create new memorials in the future, you're always welcome back.\n\n"
                "With warmth,\nThe PetHeavenOnline Team"
            )
            html = (
                '<div style="font-family:Arial,sans-serif;max-width:600px;color:#2e2640;">'
                f'<p>Hi {saved_first},</p>'
                '<p>Your account and all associated memorials have been permanently deleted as requested.</p>'
                "<p>We're sorry to see you go. If you ever want to create new memorials in the future, you're always welcome back.</p>"
                '<p>With warmth,<br>The PetHeavenOnline Team</p>'
                '</div>'
            )
            msg = EmailMultiAlternatives(
                subject=_email_subject('🐾 Your PetHeavenOnline account has been deleted'),
                body=plain,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[saved_email],
            )
            msg.attach_alternative(html, 'text/html')
            msg.send()
        except Exception as e:
            print(f"Account deletion email error: {e}")

        from memorials.models import Memorial
        Memorial.objects.filter(user=user).delete()
        logout(request)
        user.delete()
        return redirect('/')
    return render(request, 'accounts/delete_account.html')
