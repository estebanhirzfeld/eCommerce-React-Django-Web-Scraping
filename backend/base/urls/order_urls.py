from django.urls import path
from base.views import order_view as views

urlpatterns = [ 
    path('', views.getOrders, name='orders'),
    path ('pay/', views.mercadoPagoWebhook, name='webhook'),
    path('add/', views.addOrderItems, name='orders-add'),
    path ('myorders/', views.getMyOrders, name='myorders'),
    path ('<str:pk>/', views.getOrderById, name='user-order'),
    path('user/<str:pk>/', views.getOrdersByUser, name='orders'),

    # path ('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
]
