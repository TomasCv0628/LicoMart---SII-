from django.shortcuts import render , redirect
from .forms import ProductoForm
from .models import  Productos


# Create your views here.

def crear_producto(request):
    if request.method == "POST":
        form = ProductoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('lista_productos')
    else:
        form = ProductoForm()
    return render(request, 'crear_producto.html', {'form': form})

def lista_productos(request):
    productos = Productos.objects.all()  # Obtener todos los productos
    return render(request, 'lista_productos.html', {'productos': productos})
