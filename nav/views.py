from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import logout, login, authenticate
from .models import MyUser as User
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        return render(request, 'nav/index.html')
    else:
        return HttpResponseRedirect(reverse('register'))

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            return HttpResponseNotFound('Invalid login')
    else:
        return render(request, 'nav/login.html')

def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
    return HttpResponseRedirect(reverse('login'))

def register_view(request):
    if request.method == 'POST':
        role = request.POST['role']
        username = request.POST['username']
        password = request.POST['password']
        name = request.POST['full_name']
        user = User.objects.create_user(username=username, password=password, name=name, role=role)
        user.save()
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'nav/register.html')
    

@csrf_exempt
def update_user_location(request):
    if request.user.is_authenticated:
        # Parse the JSON body of the request
        data = json.loads(request.body)
        lat = float(data["lat"])
        lon = float(data["lon"])
        request.user.lat = lat
        request.user.lon = lon
        request.user.save()
        return HttpResponse('Location updated')
    else:
        return HttpResponseNotFound('User not found')