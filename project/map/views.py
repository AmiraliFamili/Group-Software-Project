""" views.py
Sebastian Root - wrote all except folium and geocoder code
Christopher Sadler - wrote folium and geocoder code
"""
from django.shortcuts import render, redirect
from django.contrib import messages
from game.models import Location, Item, Inventory
from .forms import CodeForm

import folium
import geocoder
import random

colors = {
    "NONE" : "black",
    "ECO" : "green",
    "WATER" : "blue",
    "POINT" : "red"
}

def map(request):
    location = geocoder.google("Exeter")
    country = location.country
    lat = location.lat
    lng = location.lng

    # Initialize a Folium map centered around Exeter
    m = folium.Map(location=[50.7352622, -3.5355904], zoom_start=16)

    # Retrieve all locations from the database and add markers to the map
    locations = Location.objects.all()
    for location in locations:
        folium.Marker(
            [location.latitude, location.longitude],
            popup = folium.Popup(f"<b>{location.name}</b> <br> <i>{location.description}</i>", max_width=500),
            icon = folium.Icon(colors[location.type])
        ).add_to(m)

    # Convert the map to HTML
    m = m._repr_html_()
    context = {'m': m}

    return render(request, 'map/mappage.html', context)

def code_entry(request):
    if request.method == "POST":
        form = CodeForm(request.POST)
        if form.is_valid():
            # Get the entered code from the form
            code = form.cleaned_data.get("code")
            try:
                # Try to find the location associated with the entered code
                location = Location.objects.get(code=code)

                # Check if the location is already unlocked by the user
                if location in request.user.userprofile.unlocked_locations.all():
                    messages.error(request, "You already own this location.")
                    return redirect("code_entry")

                # Add the unlocked location to the user's profile
                request.user.userprofile.unlocked_locations.add(location)
                messages.success(request, "Location unlocked!")

                # Give the user a random item
                item = random.choice(Item.objects.all())

                # Create a new inventory item for the user
                inventory = Inventory.objects.create(item=item, userprofile=request.user.userprofile)
                inventory.save()

                return render(request, "map/submit-location-code.html", {"form": form, "item": item})

            except Location.DoesNotExist:
                messages.error(request, "Invalid code.")
                return redirect("code_entry")
    else:
        form = CodeForm()
        return render(request, "map/submit-location-code.html", {"form": form})
