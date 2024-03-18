from django.shortcuts import render, redirect
from django.contrib import messages
from game.models import Location, Item, Inventory
from .forms import CodeForm

import folium
import geocoder
import random


colors = ["red", "green", "black", "blue"]

def map(request):
   location = geocoder.google("Exeter")
   country = location.country
   lat = location.lat
   lng = location.lng
   m = folium.Map(location=[50.7352622, -3.5355904], zoom_start=16)
   
   locations = Location.objects.all()
   for location in locations:
      folium.Marker(
         [location.latitude, location.longitude],
         popup = location.name,
         icon = folium.Icon(color=random.choice(colors))
      ).add_to(m)

   
   m = m._repr_html_()
   context = {
      'm' : m,
      }
   
   return render(request, 'map/mappage.html', context)

def code_entry(request):
    if request.method == "POST":
        form = CodeForm(request.POST)
        if form.is_valid():
            code = form.cleaned_data.get("code")
            try:
                location = Location.objects.get(code=code)
                if location in request.user.userprofile.unlocked_locations.all():
                    messages.error(request, "You already own this location.")
                    return redirect("code_entry")

                request.user.userprofile.unlocked_locations.add(location)
                messages.success(request, "Location unlocked!")

                # Give the user a random item
                item = random.choice(Item.objects.all())
                
                # Check if the user already owns the item
                inventory, created = Inventory.objects.get_or_create(item=item, userprofile=request.user.userprofile)
                if created:
                    inventory.quantity = 1
                else:
                    inventory.quantity += 1
                inventory.save()

                # Pass the item to the template
                return render(request, "authentication/submit-location-code.html", {"form": form, "item": item})

            except Location.DoesNotExist:
                messages.error(request, "Invalid code.")
                return redirect("code_entry")
    else: 
        form = CodeForm()
        return render(request, "map/submit-location-code.html", {"form": form})
