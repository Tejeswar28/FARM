from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import UserProfile

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('/')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})
    return render(request, 'login.html')

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        phone = request.POST.get('phone')
        if password1 == password2:
            user = User.objects.create_user(username=username, email=email, password=password1)
            UserProfile.objects.create(user=user, phone=phone)
            return redirect('/users/login/')
        else:
            return render(request, 'signup.html', {'error': 'Passwords do not match'})
    return render(request, 'signup.html')

def logout_view(request):
    logout(request)
    return redirect('/')
