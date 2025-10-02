from django.http import JsonResponse
from productos.models import Productos

def index(request):
    productos = list(Productos.objects.values())
    return JsonResponse({'productos': productos})

