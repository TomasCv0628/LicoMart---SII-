from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from django.contrib.auth import login , logout, authenticate
# Create your views here.

def index(request):
    return render(request, 'index.html') 

def singup(request):
    if request.method == 'GET':
        return render(request, 'singup.html', {
        'form': UserCreationForm
    }) 
    else:
        if request.POST['password1'] == request.POST['password2']:
            try:
                user = User.objects.create_user(username=request.POST['username'] , password=request.POST['password1'])
                user.save()
                login(request , user)
                return redirect('pedido')
            except:
                return render(request, 'singup.html', {
                    'form': UserCreationForm,
                    'error': 'Ya existente'
                })
            
        return render(request, 'singup.html', {
                    'form': UserCreationForm,
                    'error': 'Constraseñas no coinciden'
        })

def pedidos(request):
    return render(request , 'pedido.html')

def singout(request):
    logout(request)
    return redirect('home')

def singin(request):
    if request.method == 'GET':
        return render(request, 'singin.html', {
        'form': AuthenticationForm
    }) 
    else:
        user = authenticate(request, username= request.POST['username'] , password=request.POST['password'])
        if user is None:
            return render(request, 'singin.html', {
                'form': AuthenticationForm,
                'error': 'Usuario o Constraseña incorrectos'
            })
        else:
            login(request, user)
            return redirect('home')

