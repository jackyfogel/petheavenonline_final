from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .forms import RegisterForm


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
