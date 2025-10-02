from django.http import JsonResponse
from django.shortcuts import render, redirect
from .forms import ProductoForm
from .models import Productos


# Create your views here.

def crear_producto(request):
    if request.method == "POST":
        form = ProductoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True, 'message': 'Producto creado exitosamente'})
        return JsonResponse({'success': False, 'error': 'Datos inválidos', 'errors': form.errors})

    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

def lista_productos(request):
    productos = list(Productos.objects.values())
    return JsonResponse({'productos': productos})
