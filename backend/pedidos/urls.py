from django.urls import path
from . import views

urlpatterns = [
    path('', views.pedidos, name='pedido'),
    path('crear/', views.crear_pedido, name='crear_pedido')
]
