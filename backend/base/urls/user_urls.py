from django.urls import path
from base.views import user_views as views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.getUsers, name='users'),
    path('register', views.registerUser, name='users-register'),
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # password reset
    
    path('reset_password/', views.reset_password, name='reset_password'),
    # path('reset_password_sent/', auth_views.ResetPasswordDoneView.as_view(), name='password_reset_done'),
    path('reset_password_confirm/<uidb64>/<token>/', views.reset_password_confirm , name='password_reset_confirm'),
    path('reset_password_complete/', views.ResetPasswordCompleteView.as_view(), name='password_reset_complete'),


    path('profile/', views.getUserProfile, name='users-profile'),
    path('profile/update/', views.updateUserProfile, name='users-update'),
    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
    path('update/<str:pk>/', views.updateUser, name='user-update'),
    path('<str:pk>/', views.getUserById, name='user'),

]
