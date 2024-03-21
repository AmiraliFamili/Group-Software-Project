""" urls.py
Sebastian Root - wrote python code
"""
from django.contrib import admin
from django.urls import path
from . import views  # Import views from the current directory

# Define URL patterns
urlpatterns = [
    # Define the URL pattern for the main village view
    path('', views.game_view, name='village'),
    # Define the URL pattern for updating items
    path('updateitem/', views.update_item, name='update_item'),
]
