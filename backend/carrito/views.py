from datetime import date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pedidos.models import Pedidos, DetallePedido , Productos
from usuarios.models import Usuarios
from django.db import transaction
# Create your views here.

@csrf_exempt
def ver_carrito(request):
    carrito = request.session.get('carrito', {})
    total = sum(item['precio'] * item['cantidad'] for item in carrito.values())
    return JsonResponse({'carrito': carrito, 'total': total})
@csrf_exempt
@transaction.atomic
def confirmar_compra(request):
    carrito = request.session.get('carrito', {})
    if not carrito:
        return JsonResponse({'success': False, 'error': 'El carrito está vacío'})

    usuario_id = request.session.get('usuario_id')
    if not usuario_id:
        return JsonResponse({'success': False, 'error': 'Usuario no autenticado'})

    # Validar stock de todos antes de crear pedido
    for producto_id, item in carrito.items():
        producto = Productos.objects.get(id=producto_id)
        if producto.stock < item['cantidad']:
            return JsonResponse({'success': False, 'error': f"No hay suficiente stock para {producto.nombre}"})

    pedido = Pedidos.objects.create(
        id_usuario=Usuarios.objects.get(id=usuario_id),
        fecha=date.today(),
        estado='Pendiente'
    )

    # Guardar detalles
    for producto_id, item in carrito.items():
        producto = Productos.objects.get(id=producto_id)
        producto.stock -= item['cantidad']
        producto.save()

        DetallePedido.objects.create(
            id_pedido=pedido,
            id_producto=producto,
            cantidad=item['cantidad'],
            subtotal=item['precio'] * item['cantidad']
        )

    request.session['carrito'] = {}
    return JsonResponse({'success': True, 'message': 'Compra confirmada', 'pedido_id': pedido.id})
def lista_productos(request):
    productos = list(Productos.objects.values())
    return JsonResponse({'productos': productos})

def get_object_or_404(model, **kwargs):
    raise NotImplementedError

@csrf_exempt
def agregar_al_carrito(request, producto_id):
    if request.method == "POST":
        import json
        try:
            data = json.loads(request.body)
            cantidad = int(data.get('cantidad', 1))
        except (json.JSONDecodeError, ValueError):
            cantidad = 1
        
        try:
            producto = Productos.objects.get(id=producto_id)
        except Productos.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Producto no encontrado'}, status=404)

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
        return JsonResponse({'success': True, 'message': 'Producto agregado al carrito'})

    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_del_carrito(request, producto_id):
    carrito = request.session.get('carrito', {})

    if str(producto_id) in carrito:
        del carrito[str(producto_id)]

    request.session['carrito'] = carrito
    return JsonResponse({'success': True, 'message': 'Producto eliminado del carrito'})
