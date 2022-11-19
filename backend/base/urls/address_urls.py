from django.urls import path
from base.views import address_view as views

urlpatterns = [
    path('', views.getAddresses, name='addresses'),
    path('create/', views.createAddress, name='address-create'),
]
