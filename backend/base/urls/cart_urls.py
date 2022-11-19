from django.urls import path
from base.views import cart_view as views

urlpatterns = [
    path('', views.getCartItems, name='cart'),
    path('remove/<str:pk>/', views.removeFromCart, name='remove-from-cart'),
    path('add/<str:pk>/', views.addToCart, name='add-cart'),
    path('clear/', views.clearCartItems, name='cart-clear'),
]
