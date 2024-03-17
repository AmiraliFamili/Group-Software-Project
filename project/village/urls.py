from django.contrib import admin
from django.urls import path
from . import views;

urlpatterns = [
    path('', views.game_view, name='village'),
    path('updateitem/', views.update_item, name='update_item'),
]