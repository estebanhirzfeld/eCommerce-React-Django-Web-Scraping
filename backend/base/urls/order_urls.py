from django.urls import path
from base.views import order_view as views

urlpatterns = [ 
    path('test/', views.test, name='test'),
    path('', views.getOrders, name='orders'),
    path ('pay/<str:pk>/', views.mercadoPagoWebhook, name='webhook'),
    path('add/', views.addOrderItems, name='orders-add'),
    path ('myorders/', views.getMyOrders, name='myorders'),
    path('pay/proof/<str:pk>/', views.attachProof, name='payment-proof'),

#   Admin
    path('update/paid/<str:pk>/', views.updateOrderToPaid, name='paid'),
    path('update/delivered/<str:pk>/', views.updateOrderToDelivered, name='delivered'),
    
    path('update/tracking/<str:pk>/', views.updateOrderTracking, name='tracking-number'),
    path('update/tracking/url/<str:pk>/', views.updateOrderTrackingUrl, name='tracking-url'),

    path('unlogged/<str:pk>/<str:token>/', views.getOrderByToken, name='user-order-unlogged'),
    path('unlogged/pay/proof/<str:pk>/<str:token>/', views.attachProofUnlogged, name='payment-proof-unlogged'),

    path ('<str:pk>/', views.getOrderById, name='user-order'),
    path('user/<str:pk>/', views.getOrdersByUser, name='orders'),


]
