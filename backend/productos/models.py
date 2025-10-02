from django.db import models

# Create your models here.

class Productos(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    stock = models.IntegerField()
    precio = models.FloatField()
    imagen = models.URLField(max_length=500, blank=True, null=True)  # Cambiado a URLField

    def __str__(self):
        return self.nombre
