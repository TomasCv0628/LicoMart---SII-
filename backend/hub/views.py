from django.shortcuts import render
from productos.models import Productos

def index(request):
    productos = Productos.objects.all()
    return render(request, 'index.html', {'productos': productos})

