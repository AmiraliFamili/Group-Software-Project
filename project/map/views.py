from django.shortcuts import render
import folium
import geocoder
# Create your views here.

def map(request):
   location = geocoder.osm('paris')#any country name
   country = location.country
   lat = location.lat
   lng = location.lng
   m = folium.Map(location=[50.7352622, -3.5355904], zoom_start=16)
   folium.Marker([50.7352622, -3.5355904], tooltio='click for more', popup='Ghana').add_to(m)
   folium.Marker([lat, lng], tooltio='click for more', popup=country).add_to(m)
   m = m._repr_html_()
   context = {
      'm' : m,
      }
   
   return render(request, 'map/mappage.html', context)

