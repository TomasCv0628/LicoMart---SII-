from django.db import models
from productos.models import Productos
from usuarios.models import Usuarios

# Create your models here.

class Pedidos(models.Model):
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('En Proceso', 'En Proceso'),
        ('Completado', 'Completado'),
        ('Cancelado', 'Cancelado'),
    ]

    id_usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE, related_name='pedidos')
    fecha = models.DateField()
    estado = models.CharField(max_length=50, choices=ESTADOS, default='Pendiente')

    def __str__(self):
        return f"Pedido {self.id} de {self.id_usuario.nombre}"



class DetallePedido(models.Model):
    id_pedido = models.ForeignKey(Pedidos, on_delete=models.CASCADE, related_name='detalles')
    id_producto = models.ForeignKey(Productos, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    subtotal = models.FloatField(editable=False)

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.id_producto.precio
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Detalle del Pedido {self.id_pedido.id} - Producto {self.id_producto.nombre}"