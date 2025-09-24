from django.urls import path
from . import views

urlpatterns = [

    path('', views.index, name='home'),
    path('singup/', views.singup, name="singup"), 
    path('singin/', views.singin, name="singin"), 
    path('logout/', views.singout, name="logout"), 
    path('pedido/', views.pedidos, name="pedido"), 
    path('pedido/crear/', views.crear_pedido, name='crear_pedido'),
    path('usuarios/crear/', views.crear_usuario, name="crear_usuario"),
    path('productos/crear/', views.crear_producto, name="crear_producto"),
]
