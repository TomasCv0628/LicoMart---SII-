from django.shortcuts import render , redirect
from django.http import JsonResponse
from productos.models import  Productos

# Create your views here.

def ver_carrito(request):
    carrito = request.session.get('carrito', {})
    total = sum(item['precio'] * item['cantidad'] for item in carrito.values())
    return JsonResponse({'carrito': carrito, 'total': total})

def confirmar_compra(request):
    carrito = request.session.get('carrito', {})
    if not carrito:
        return JsonResponse({'success': False, 'error': 'El carrito está vacío'})

    usuario_id = request.session.get('usuario_id')
    if not usuario_id:
        return JsonResponse({'success': False, 'error': 'Usuario no autenticado'})

    pedido = Pedidos.objects.create(
        id_usuario=Usuarios.objects.get(id=usuario_id),
        fecha=date.today(),
        estado='Pendiente'
    )

    for producto_id, item in carrito.items():
        producto = Productos.objects.get(id=producto_id)
        if producto.stock < item['cantidad']:
            return JsonResponse({'success': False, 'error': f"No hay suficiente stock para {producto.nombre}"})

        producto.stock -= item['cantidad']
        producto.save()

        DetallePedido.objects.create(
            id_pedido=pedido,
            id_producto=producto,
            cantidad=item['cantidad'],
            subtotal=item['precio'] * item['cantidad']
        )

    request.session['carrito'] = {}
    return JsonResponse({'success': True, 'message': 'Compra confirmada'})

def lista_productos(request):
    productos = list(Productos.objects.values())
    return JsonResponse({'productos': productos})

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
        return JsonResponse({'success': True, 'message': 'Producto agregado al carrito'})

    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

def eliminar_del_carrito(request, producto_id):
    carrito = request.session.get('carrito', {})

    if str(producto_id) in carrito:
        del carrito[str(producto_id)]

    request.session['carrito'] = carrito
    return JsonResponse({'success': True, 'message': 'Producto eliminado del carrito'})
