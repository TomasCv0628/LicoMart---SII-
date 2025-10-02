from django.urls import path
from . import views

urlpatterns = [
    path('pedido/', views.pedidos, name='pedido'),
    path('pedido/crear/', views.crear_pedido, name='crear_pedido')
]
