from django.db import models

# Create your models here.

class Usuarios(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    contraseña = models.CharField(max_length=100)
    rol = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre
    

class Pedidos(models.Model):
    id_usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    fecha = models.DateField()
    estado = models.CharField(max_length=50)

    def __str__(self):
        return f"Pedido {self.id} de {self.id_usuario.nombre}"


class Productos(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=200)
    stock = models.IntegerField()
    precio = models.FloatField()

    def __str__(self):
        return self.nombre


class DetallePedido(models.Model):
    id_pedido = models.ForeignKey(Pedidos, on_delete=models.CASCADE)
    id_producto = models.ForeignKey(Productos, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    subtotal = models.FloatField()