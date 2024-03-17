from django.shortcuts import render
from django.http import JsonResponse
from game.models import UserProfile, Item, Inventory
import json

def game_view(request):
    user_profile = UserProfile.objects.get(user=request.user)
    inventory_items = user_profile.inventory_items.all()
    context = {"inventory_items": inventory_items}
    return render(request, "village/village.html", context)

def update_item(request):
    if request.method == "POST":
        print("Me")
        data = json.loads(request.body)
        inventory = Inventory.objects.get(id=data['id'])
        inventory.set_position(data['row'], data['col'])
        inventory.save()
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request method'})