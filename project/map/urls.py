""" urls.py
Sebastian Root - wrote python code"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.map, name='map_index'),
    path('code', views.code_entry, name='code_entry')
]

