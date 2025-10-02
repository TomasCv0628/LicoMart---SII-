from django.http import JsonResponse
import datetime
from .forms import PedidoForm, DetallePedidoFormSet

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
