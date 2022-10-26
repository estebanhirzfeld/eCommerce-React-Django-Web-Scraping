from django.urls import path
from base.views import product_views as views

urlpatterns = [
    path('', views.getProducts, name='products'),
    path('review/<str:pk>/', views.createReview, name='review'),
    path('upload/', views.uploadImage, name='image-upload'),
    path('delete/<int:pk>/', views.deleteProduct, name='product-delete'),
    path('update/<int:pk>/', views.updateProduct, name='product-update'),
    path('create/', views.createProduct, name='product-create'),
    path('<int:pk>/', views.getProduct, name='product'),
]
