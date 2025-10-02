import datetime
from django.shortcuts import render, redirect
from .forms import PedidoForm, DetallePedidoFormSet

# Create your views here.
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
