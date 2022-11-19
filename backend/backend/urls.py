from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/users/', include('base.urls.user_urls')),
    path('api/products/', include('base.urls.product_urls')),
    path('api/orders/', include('base.urls.order_urls')),
    path('api/cart/', include('base.urls.cart_urls')),
    path('api/address/', include('base.urls.address_urls')),
    path('api/lists/', include('base.urls.lists_urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


