from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from django.contrib.auth import login , logout, authenticate
from .forms import PedidoForm, DetallePedidoFormSet,UsuarioForm,ProductoForm
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

def pedidos(request):
    return render(request , 'pedido.html')

def crear_pedido(request):
    if request.method == "POST":
        pedido_form = PedidoForm(request.POST)
        formset = DetallePedidoFormSet(request.POST)

        if pedido_form.is_valid() and formset.is_valid():
            pedido = pedido_form.save()
            detalles = formset.save(commit=False)
            for detalle in detalles:
                detalle.id_pedido = pedido
                detalle.save()
            return redirect('lista_pedidos')
    else:
        pedido_form = PedidoForm()
        formset = DetallePedidoFormSet()

    return render(request, 'crear_pedido.html', {
        'pedido_form': pedido_form,
        'formset': formset
    })

def crear_usuario(request):
    if request.method == "POST":
        form = UsuarioForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_usuarios')
    else:
        form = UsuarioForm()
    return render(request, 'crear_usuario.html', {'form': form})

def crear_producto(request):
    if request.method == "POST":
        form = ProductoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_productos')
    else:
        form = ProductoForm()
    return render(request, 'crear_producto.html', {'form': form})