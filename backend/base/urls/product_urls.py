from django.urls import path
from base.views import product_views as views

urlpatterns = [
    path('', views.getProducts, name='products'),
    path('category/<str:category>/', views.getProductsByCategory, name='products-by-category'),
    path('review/<str:pk>/', views.createReview, name='review'),
    path('upload/', views.uploadImages, name='image-upload'),
    path('image/delete/<str:pk>/', views.deleteImage, name='image-delete'),
    path('delete/<int:pk>/', views.deleteProduct, name='product-delete'),
    path('update/<int:pk>/', views.updateProduct, name='product-update'),
    path('create/', views.createProduct, name='product-create'),
    path('<int:pk>/', views.getProduct, name='product'),

    path('scrape/<int:pk>/', views.scrapeProduct, name='product-scrape'),
    path('scrape/discover/', views.discoverProducts, name='products-discover'),
    # path('scrape/', views.scrapeProducts, name='products-scrape'),
]
