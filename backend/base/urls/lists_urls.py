from django.urls import path
from base.views import lists_view as views

urlpatterns = [
    path('wishlist/', views.getWishListItems, name='wish-list'),
    path('wishlist/remove/<str:pk>/', views.removeFromWishList, name='remove-from-wish-list'),
    path('wishlist/add/<str:pk>/', views.addToWishList, name='add-wish-list'),
    
    path('forlater/', views.getSavedForLaterItems, name='for-later'),
    path('forlater/add/<str:pk>/', views.addToSavedForLater, name='add-for-later'),
    path('forlater/remove/<str:pk>/', views.removeFromSavedForLater, name='remove-from-for-later'),

]

