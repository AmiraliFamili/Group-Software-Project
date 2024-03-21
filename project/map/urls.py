""" urls.py
Sebastian Root - wrote python code"""
from django.urls import path
from . import views

urlpatterns = [
    path('map/', views.map, name='map_index'),
    path('map/code', views.code_entry, name='code_entry')
]

