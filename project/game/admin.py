from django import forms
from django.contrib import admin
from .models import UserProfile, Location, Item, Inventory

## Creates a single line to allow gamekeepers to view item positions for each item a user owns.
class InventoryInlineFormset(forms.BaseInlineFormSet):
    def _construct_form(self, i, **kwargs):
        form = super()._construct_form(i, **kwargs)
        form.fields['position'].required = False
        return form

# Displays the inventory as an inline list for easier viewing and changing.
class InventoryInline(admin.TabularInline):
    model = Inventory
    formset = InventoryInlineFormset
    extra = 1

# Displays a user's profile with the number of unlocked locations they have as part of the form.
class UserProfileForm(forms.ModelForm):
    unlocked_locations = forms.ModelMultipleChoiceField(
        queryset = Location.objects.all(),
        required=False
    )

# Combines the previously defined functions into a singularly defined admin
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


