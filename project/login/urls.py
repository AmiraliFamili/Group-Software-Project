""" urls.py
Amirali Famili - wrote python code
Sebastian Root - reformatted file
"""
from django.contrib import admin
from django.urls import path, include
from . import views;

urlpatterns = [
    path('', views.home, name="home"),
    path('signup', views.signup, name="signup"),
    path('signin', views.signin, name="signin"),
    path('signout/', views.signout, name="signout"),
]
