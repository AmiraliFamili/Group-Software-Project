from django.shortcuts import render
from game.models import Location
import folium
import geocoder
import random
# Create your views here.

colors = ["red", "green", "black", "blue"]

def map(request):
   location = geocoder.google('Exeter')
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
   return render(request, "authentication/submit-location-code.html")