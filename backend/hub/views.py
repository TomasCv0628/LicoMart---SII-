from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from django.shortcuts import render, redirect, get_object_or_404
from .forms import PedidoForm, DetallePedidoFormSet, ProductoForm
from .models import Usuarios, Productos, Pedidos, DetallePedido
from datetime import datetime, date

def index(request):
    productos = Productos.objects.all()
    return render(request, 'index.html', {'productos': productos})

def auth_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            usuario = Usuarios.objects.get(nombre=username, email=email)
            if usuario.check_password(password):
                request.session['usuario_id'] = usuario.id
                return redirect('home')
            else:
                return render(request, 'auth.html', {'error': 'Contraseña incorrecta'})
        except Usuarios.DoesNotExist:
            if Usuarios.objects.filter(nombre=username).exists():
                return render(request, 'auth.html', {'error': 'El nombre de usuario ya está en uso.'})

            nuevo_usuario = Usuarios(nombre=username, email=email, rol='usuario')
            nuevo_usuario.set_password(password)
            nuevo_usuario.save()
            request.session['usuario_id'] = nuevo_usuario.id
            return redirect('home')

    return render(request, 'auth.html')

def login_view(request):
    if request.method == 'POST':
        identifier = request.POST.get('identifier')  # Puede ser usuario o correo
        password = request.POST.get('password')

        try:
            usuario = Usuarios.objects.get(nombre=identifier) if Usuarios.objects.filter(nombre=identifier).exists() else Usuarios.objects.get(email=identifier)
            if usuario.check_password(password):  # Verificar contraseña
                request.session['usuario_id'] = usuario.id
                return redirect('home')  # Redirigir al home después de iniciar sesión
            else:
                return render(request, 'login.html', {'error': 'Contraseña incorrecta'})
        except Usuarios.DoesNotExist:
            return render(request, 'login.html', {'error': 'Usuario o correo no encontrado'})

    return render(request, 'login.html')

def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Verificar si el nombre de usuario o correo ya existen
        if Usuarios.objects.filter(nombre=username).exists():
            return render(request, 'register.html', {'error': 'El nombre de usuario ya está en uso.'})
        if Usuarios.objects.filter(email=email).exists():
            return render(request, 'register.html', {'error': 'El correo ya está en uso.'})

        # Crear el nuevo usuario
        nuevo_usuario = Usuarios(nombre=username, email=email, rol='usuario')
        nuevo_usuario.set_password(password)  # Guardar contraseña segura
        nuevo_usuario.save()
        return redirect('login')  # Redirigir al login después del registro

    return render(request, 'register.html')

def singout(request):
    if 'usuario_id' in request.session:
        del request.session['usuario_id']
    return redirect('home')

def pedidos(request):
    return render(request, 'pedido.html')

def crear_pedido(request):
    if request.method == "POST":
        pedido_form = PedidoForm(request.POST)
        formset = DetallePedidoFormSet(request.POST)

        if pedido_form.is_valid() and formset.is_valid():
            pedido = pedido_form.save(commit=False)
            if isinstance(pedido.fecha, str):
                try:
                    pedido.fecha = datetime.strptime(pedido.fecha, '%Y-%m-%d').date()
                except ValueError:
                    return render(request, 'crear_pedido.html', {
                        'pedido_form': pedido_form,
                        'formset': formset,
                        'error': 'Formato de fecha inválido. Use YYYY-MM-DD.'
                    })

            pedido.save()
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

def crear_producto(request):
    if request.method == "POST":
        form = ProductoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('lista_productos')
    else:
        form = ProductoForm()
    return render(request, 'crear_producto.html', {'form': form})

def ver_carrito(request):
    carrito = request.session.get('carrito', {})
    total = sum(item['precio'] * item['cantidad'] for item in carrito.values())
    return render(request, 'carrito.html', {'carrito': carrito, 'total': total})

def confirmar_compra(request):
    carrito = request.session.get('carrito', {})
    if not carrito:
        return redirect('ver_carrito')

    usuario_id = request.session.get('usuario_id')
    if not usuario_id:
        return redirect('login')

    pedido = Pedidos.objects.create(
        id_usuario=Usuarios.objects.get(id=usuario_id),
        fecha=date.today(),
        estado='Pendiente'
    )

    for producto_id, item in carrito.items():
        producto = Productos.objects.get(id=producto_id)
        if producto.stock < item['cantidad']:
            return render(request, 'carrito.html', {
                'carrito': carrito,
                'total': sum(i['precio'] * i['cantidad'] for i in carrito.values()),
                'error': f"No hay suficiente stock para {producto.nombre}."
            })

        producto.stock -= item['cantidad']
        producto.save()

        DetallePedido.objects.create(
            id_pedido=pedido,
            id_producto=producto,
            cantidad=item['cantidad'],
            subtotal=item['precio'] * item['cantidad']
        )

    request.session['carrito'] = {}
    return redirect('home')

def lista_productos(request):
    productos = Productos.objects.all()  # Obtener todos los productos
    return render(request, 'lista_productos.html', {'productos': productos})

def agregar_al_carrito(request, producto_id):
    if request.method == "POST":
        cantidad = int(request.POST.get('cantidad', 1))
        producto = get_object_or_404(Productos, id=producto_id)

        carrito = request.session.get('carrito', {})

        if str(producto_id) in carrito:
            carrito[str(producto_id)]['cantidad'] += cantidad
        else:
            carrito[str(producto_id)] = {
                'nombre': producto.nombre,
                'precio': producto.precio,
                'cantidad': cantidad,
            }

        request.session['carrito'] = carrito
        return redirect('ver_carrito')
    
    return redirect('lista_productos')  # Redirigir si el método no es POST

def eliminar_del_carrito(request, producto_id):
    carrito = request.session.get('carrito', {})

    if str(producto_id) in carrito:
        del carrito[str(producto_id)]

    request.session['carrito'] = carrito
    return redirect('ver_carrito')