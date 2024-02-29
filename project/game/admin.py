from django import forms
from django.contrib import admin
from .models import UserProfile, Location, Item, Inventory

class UserProfileForm(forms.ModelForm):
    unlocked_locations = forms.ModelMultipleChoiceField(
        queryset = Location.objects.all(),
        required=False
    )

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "countLoc")
    form = UserProfileForm
admin.site.register(UserProfile, UserProfileAdmin)

####

class ItemAdmin(admin.ModelAdmin):
    list_display = ("name", "price")
admin.site.register(Item, ItemAdmin)

####

admin.site.register(Location)


