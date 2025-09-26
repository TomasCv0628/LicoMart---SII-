from django.forms import ModelForm
from .models import Usuarios, Productos, Pedidos, DetallePedido
from django import forms

class UsuarioForm(ModelForm):
    class Meta:
        model = Usuarios
        fields = ['nombre', 'email', 'contraseña', 'rol']

class ProductoForm(ModelForm):
    class Meta:
        model = Productos
        fields = ['nombre', 'descripcion', 'stock', 'precio']

class PedidoForm(ModelForm):
    class Meta:
        model = Pedidos
        fields = ['id_usuario', 'fecha', 'estado']


class DetallePedidoForm(ModelForm):
    class Meta:
        model = DetallePedido
        fields = ['id_producto', 'cantidad', 'subtotal']

DetallePedidoFormSet = forms.inlineformset_factory(
    Pedidos,               # Modelo padre
    DetallePedido,         # Modelo hijo
    form=DetallePedidoForm, # Qué formulario usar para los hijos
    extra=1,               # cuántos formularios vacíos mostrar por defecto
    can_delete=True        # si se pueden eliminar detalles
)