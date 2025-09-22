from django.urls import path
from . import views

urlpatterns = [
    path('', views.index ,name='home'),
    path('singup/', views.singup, name="singup"), 
    path('pedido/', views.pedidos, name="pedido"), 
    path('logout/', views.singout, name="logout"), 
    path('singin/', views.singin, name="singin"), 


    
]
