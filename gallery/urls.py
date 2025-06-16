from django.urls import path
from . import views
from . import views_farm

urlpatterns = [
    path('', views.gallery_home, name='gallery_home'),
    path('location/', views_farm.farm_location, name='farm_location'),
    path('add/', views.add_media, name='add_media'),
    path('image/<int:pk>/', views.view_image, name='view_image'),
    path('delete/<int:pk>/', views.delete_media, name='delete_media'),
    path('add-youtube-video/', views.add_youtube_video, name='add_youtube_video'),
    path('suggest-video/', views.suggest_video, name='suggest_video'),
]
