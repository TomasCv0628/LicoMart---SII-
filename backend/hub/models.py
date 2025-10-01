from django.db import models
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.

class Usuarios(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    contraseña = models.CharField(max_length=100)
    rol = models.CharField(max_length=50, default='usuario')

    def set_password(self, raw_password):
        self.contraseña = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.contraseña)

    def __str__(self):
        return self.nombre
    

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


class Productos(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    stock = models.IntegerField()
    precio = models.FloatField()
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)

    def __str__(self):
        return self.nombre


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