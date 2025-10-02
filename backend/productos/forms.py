from django.forms import ModelForm
from .models import Productos


class ProductoForm(ModelForm):
    class Meta:
        model = Productos
        fields = ['nombre', 'descripcion', 'stock', 'precio', 'imagen']
