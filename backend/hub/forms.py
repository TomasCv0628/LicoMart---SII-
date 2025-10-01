from django.forms import ModelForm, modelformset_factory, DateInput
from .models import Usuarios, Productos, Pedidos, DetallePedido
from django import forms

class UsuarioForm(ModelForm):
    class Meta:
        model = Usuarios
        fields = '__all__'

class ProductoForm(ModelForm):
    class Meta:
        model = Productos
        fields = ['nombre', 'descripcion', 'stock', 'precio', 'imagen']

class PedidoForm(ModelForm):
    class Meta:
        model = Pedidos
        fields = '__all__'
        widgets = {
            'fecha': DateInput(attrs={'type': 'date'})
        }

class DetallePedidoForm(ModelForm):
    class Meta:
        model = DetallePedido
        fields = '__all__'
        exclude = ['subtotal']

DetallePedidoFormSet = modelformset_factory(
    DetallePedido,
    fields='__all__',
    exclude=['subtotal'],
    extra=1
)