""" signals.py
Sebastian Root - wrote python code"""
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserProfile

# Signal handler to create a user profile when a new user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # If a new user is created, create a corresponding UserProfile instance
        UserProfile.objects.create(user=instance)

# Signal handler to save the user profile when the user is saved
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Whenever a User instance is saved, also save the associated UserProfile instance
    instance.userprofile.save()
