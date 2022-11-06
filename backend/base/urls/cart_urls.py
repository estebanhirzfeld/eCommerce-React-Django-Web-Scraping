from django.urls import path
from base.views import cart_view as views

urlpatterns = [
    path('', views.getCartItems, name='cart'),
    path('add/<str:pk>/', views.addCartItems, name='add-cart'),
    path('remove/', views.removeCartItems, name='cart-remove'),
    path('clear/', views.clearCartItems, name='cart-clear'),
]
