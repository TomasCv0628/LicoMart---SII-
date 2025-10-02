from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('hub.urls')),
    path('usuarios/', include('usuarios.urls')),
    path('productos/', include('productos.urls')),
    path('carrito/', include('carrito.urls')),
    path('pedidos/', include('pedidos.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)