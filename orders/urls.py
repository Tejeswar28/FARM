from django.urls import path
from . import views

urlpatterns = [
    path('book/', views.order_sheep, name='order_sheep'),
]
