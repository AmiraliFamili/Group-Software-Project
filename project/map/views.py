from django.shortcuts import render
import folium
import geocoder
# Create your views here.

def map(request):
   location = geocoder.google('Exeter')
   country = location.country
   lat = location.lat
   lng = location.lng
   m = folium.Map(location=[50.7352622, -3.5355904], zoom_start=16)
   
   folium.Marker(
      [50.7351767, -3.5336193], 
      popup='Forum',
      icon=folium.Icon(color="red"),
   ).add_to(m)
   
   folium.Marker(
      [50.73392702669082,-3.5375233106478654], 
      popup='Reed Pond',
      icon=folium.Icon(color="green"),
   ).add_to(m)
   
   folium.Marker(
      [50.7360525124617,-3.541142463445437], 
      popup='Cardiac Hill',
      icon=folium.Icon(color="green"),
   ).add_to(m)
   
   folium.Marker(
      [50.737819488851294,-3.536787170538256], 
      popup='Sports Hall',
      icon=folium.Icon(color="red"),
   ).add_to(m)
   
   folium.Marker(
      [50.73598058210191,-3.5382760895375687], 
      popup='Health Centre',
      icon=folium.Icon(color="red"),
   ).add_to(m)
   
   folium.Marker(
      [50.7369824076784,-3.533991597694619], 
      popup='Pond',
      icon=folium.Icon(color="green"),
   ).add_to(m)
   
   folium.Marker(
      [50.73779517544859,-3.529501483761195], 
      popup='Taddiforde Valley',
      icon=folium.Icon(color="green"),
   ).add_to(m)
   
   folium.Marker(
      [50.73868348889897,-3.53128939020549], 
      popup='Car Park A',
      icon=folium.Icon(color="black"),
   ).add_to(m)
   
   folium.Marker(
      [50.739137361080466,-3.5324067475042953], 
      popup='Car Park B',
      icon=folium.Icon(color="black"),
   ).add_to(m)
   
   folium.Marker(
      [50.73625690528368,-3.534270968550508], 
      popup='Car Park C',
      icon=folium.Icon(color="black"),
   ).add_to(m)
   
   folium.Marker(
      [50.737108611205365,-3.5306042929465664], 
      popup='Car Park D',
      icon=folium.Icon(color="black"),
   ).add_to(m)
   
   folium.Marker(
      [50.734677090769836,-3.538253389988708], 
      popup='Reed Hall Car Park',
      icon=folium.Icon(color="black"),
   ).add_to(m)
   
   folium.Marker(
      [50.737533218442735,-3.540122089965987], 
      popup='Clydesdale Car Park',
      icon=folium.Icon(color="black"),
   ).add_to(m)
   
   folium.Marker(
      [50.74051149382828,-3.529368536258608], 
      popup='Apiary',
      icon=folium.Icon(color="green"),
   ).add_to(m)

   
   m = m._repr_html_()
   context = {
      'm' : m,
      }
   
   return render(request, 'map/mappage.html', context)

