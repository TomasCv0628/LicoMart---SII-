from django.http import JsonResponse
import datetime
from .forms import PedidoForm, DetallePedidoFormSet
from django.db.models import Sum
from .models import Pedidos, DetallePedido
from django.views.decorators.csrf import csrf_exempt
import json

def pedidos(request):
    return JsonResponse({'success': True, 'message': 'Vista de pedidos'})

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
                    return JsonResponse({'success': False, 'error': 'Formato de fecha inválido. Use YYYY-MM-DD.'})

            pedido.save()
            detalles = formset.save(commit=False)
            for detalle in detalles:
                detalle.id_pedido = pedido
                detalle.save()
            return JsonResponse({'success': True, 'message': 'Pedido creado exitosamente'})

        return JsonResponse({'success': False, 'error': 'Datos inválidos', 'errors': pedido_form.errors})

    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)


@csrf_exempt
def crear_pedido_json(request):
    """Crea un pedido y sus detalles desde JSON.
    Body esperado:
    {
      "usuario_id": 6,
      "fecha": "2025-10-31",  # opcional, por defecto hoy
      "estado": "Pendiente",  # opcional
      "detalles": [ {"producto_id": 1, "cantidad": 2}, ... ]
    }
    """
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'JSON inválido'}, status=400)

    usuario_id = payload.get('usuario_id')
    fecha_str = payload.get('fecha')
    estado = payload.get('estado', 'Pendiente')
    detalles = payload.get('detalles', [])

    if not usuario_id or not isinstance(detalles, list) or len(detalles) == 0:
        return JsonResponse({'success': False, 'error': 'usuario_id y detalles son obligatorios'}, status=400)

    # Validaciones
    from usuarios.models import Usuarios
    from productos.models import Productos
    try:
        usuario = Usuarios.objects.get(id=usuario_id)
    except Usuarios.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Usuario no encontrado'}, status=404)

    # Parse de fecha
    if fecha_str:
        try:
            fecha = datetime.datetime.strptime(fecha_str, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({'success': False, 'error': 'Formato de fecha inválido. Use YYYY-MM-DD.'}, status=400)
    else:
        fecha = datetime.date.today()

    pedido = Pedidos.objects.create(id_usuario=usuario, fecha=fecha, estado=estado)

    created_count = 0
    for d in detalles:
        pid = d.get('producto_id')
        cantidad = d.get('cantidad')
        if not pid or not cantidad or cantidad <= 0:
            continue
        try:
            prod = Productos.objects.get(id=pid)
        except Productos.DoesNotExist:
            continue
        DetallePedido.objects.create(id_pedido=pedido, id_producto=prod, cantidad=cantidad)
        created_count += 1

    return JsonResponse({'success': True, 'message': 'Pedido creado', 'pedido_id': pedido.id, 'detalles_creados': created_count})


@csrf_exempt
def actualizar_estado_pedido(request, pedido_id: int):
    """Actualiza el estado de un pedido. Body: {"estado": "Completado"} """
    if request.method not in ['PATCH', 'POST']:
        return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'JSON inválido'}, status=400)

    nuevo_estado = payload.get('estado')
    if nuevo_estado not in ['Pendiente', 'En Proceso', 'Completado', 'Cancelado']:
        return JsonResponse({'success': False, 'error': 'Estado inválido'}, status=400)

    try:
        pedido = Pedidos.objects.get(id=pedido_id)
    except Pedidos.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Pedido no encontrado'}, status=404)

    pedido.estado = nuevo_estado
    # Si se marca como Completado, actualiza la fecha al día actual
    if nuevo_estado == 'Completado':
        pedido.fecha = datetime.date.today()
    pedido.save()
    return JsonResponse({'success': True, 'message': 'Estado actualizado', 'pedido_id': pedido.id, 'estado': pedido.estado})


def kpis(request):
    """Devuelve KPIs básicos: pedidos activos, pendientes e ingresos del mes."""
    hoy = datetime.date.today()
    primer_dia_mes = hoy.replace(day=1)

    activos = Pedidos.objects.filter(estado='En Proceso').count()
    pendientes = Pedidos.objects.filter(estado='Pendiente').count()

    ingresos_mes = (
        DetallePedido.objects
            .filter(
                id_pedido__estado='Completado',
                id_pedido__fecha__gte=primer_dia_mes,
                id_pedido__fecha__lte=hoy,
            )
            .aggregate(total=Sum('subtotal'))
            .get('total')
    ) or 0

    return JsonResponse({
        'success': True,
        'data': {
            'activos': activos,
            'pendientes': pendientes,
            'ingresosMes': ingresos_mes,
        }
    })


def top_vendidos(request):
    """Top productos por unidades vendidas (sumatoria de cantidad en detalles)."""
    try:
        limit = int(request.GET.get('limit', '5'))
    except ValueError:
        limit = 5

    qs = (
        DetallePedido.objects
        .values('id_producto__nombre')
        .annotate(ventas=Sum('cantidad'))
        .order_by('-ventas')[:limit]
    )

    data = [{
        'producto': r['id_producto__nombre'],
        'ventas': r['ventas']
    } for r in qs]

    return JsonResponse({'success': True, 'data': data})


def pedidos_recientes(request):
    """Lista de pedidos recientes con cliente, estado y fecha."""
    try:
        limit = int(request.GET.get('limit', '10'))
    except ValueError:
        limit = 10

    qs = (
        Pedidos.objects
        .select_related('id_usuario')
        .order_by('-id')[:limit]
    )

    data = [{
        'id': p.id,
        'cliente': p.id_usuario.nombre,
        'estado': p.estado,
        'fecha': p.fecha.strftime('%d/%m/%Y') if isinstance(p.fecha, datetime.date) else str(p.fecha)
    } for p in qs]

    return JsonResponse({'success': True, 'data': data})
