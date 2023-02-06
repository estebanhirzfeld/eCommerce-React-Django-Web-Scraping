from django.urls import path
from base.views import order_view as views

urlpatterns = [ 
    path('test/', views.test, name='test'),
    path('', views.getOrders, name='orders'),
    path ('pay/<str:pk>/', views.mercadoPagoWebhook, name='webhook'),
    path('add/', views.addOrderItems, name='orders-add'),
    path ('myorders/', views.getMyOrders, name='myorders'),

    path('update/paid/<str:pk>/', views.updateOrderToPaid, name='paid'),
    path('update/delivered/<str:pk>/', views.updateOrderToDelivered, name='delivered'),


    path ('<str:pk>/', views.getOrderById, name='user-order'),
    path('user/<str:pk>/', views.getOrdersByUser, name='orders'),


]
