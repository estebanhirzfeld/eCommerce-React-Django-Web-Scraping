from django.urls import path
from ..views import ticker_views as views

urlpatterns = [
    path('', views.get_ticker, name="get-ticker"),
]
