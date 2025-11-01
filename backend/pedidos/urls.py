from django.urls import path
from . import views

urlpatterns = [
    path('', views.pedidos, name='pedido'),
    path('crear/', views.crear_pedido, name='crear_pedido'),
    path('crear-json/', views.crear_pedido_json, name='crear_pedido_json'),
    path('<int:pedido_id>/estado/', views.actualizar_estado_pedido, name='actualizar_estado_pedido'),
    path('kpis/', views.kpis, name='kpis'),
    path('top-vendidos/', views.top_vendidos, name='top_vendidos'),
    path('recientes/', views.pedidos_recientes, name='pedidos_recientes'),
]
