from django import forms
from django.contrib import admin
from .models import UserProfile, Location, Item, Inventory

class InventoryInlineFormset(forms.BaseInlineFormSet):
    def _construct_form(self, i, **kwargs):
        form = super()._construct_form(i, **kwargs)
        form.fields['position'].required = False
        return form

class InventoryInline(admin.TabularInline):
    model = Inventory
    formset = InventoryInlineFormset
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


