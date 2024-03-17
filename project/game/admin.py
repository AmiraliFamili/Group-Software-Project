from django import forms
from django.contrib import admin
from .models import UserProfile, Location, Item, Inventory

class InventoryInline(admin.TabularInline):
    model = Inventory
    extra = 1

class UserProfileForm(forms.ModelForm):
    unlocked_locations = forms.ModelMultipleChoiceField(
        queryset = Location.objects.all(),
        required=False
    )

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "countLoc")
    form = UserProfileForm
    inlines = [InventoryInline]

admin.site.register(UserProfile, UserProfileAdmin)

####

class ItemAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "image")
admin.site.register(Item, ItemAdmin)

####

admin.site.register(Location)


