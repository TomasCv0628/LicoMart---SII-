from django.shortcuts import render
from .models import Usuarios
from django.shortcuts import render, redirect

# Create your views here.
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
