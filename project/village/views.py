""" views.py
Sebastian Root - wrote python code
"""
from django.shortcuts import render
from django.http import JsonResponse
from game.models import UserProfile, Item, Inventory
import json

def game_view(request):
    user_profile = UserProfile.objects.get(user=request.user)
    inventory_items = user_profile.inventory_items.all()

    # If the user has no inventory items or none of them have positions, initialize default items
    if not inventory_items or all(not item.position for item in inventory_items):
        # Define default items with their positions
        items = [(20, 27, "Palm Tree"),(13, 25, "Palm Tree"),(4, 23, "Palm Tree"),(17, 22, "Palm Tree"),(25, 21, "Palm Tree"),(5, 18, "Palm Tree"),(13, 18, "Hut"),(10, 16, "Vegetable Patch"),(14, 16, "Palm Tree"),(17, 16, "Bikeshed"),(14, 14, "Hut"),(10, 13, "Hut"),(3, 12, "Palm Tree"),(11, 12, "Palm Tree"),(26, 12, "Palm Tree"),(21, 7, "Palm Tree"),(8, 6, "Palm Tree"),(14, 5, "Palm Tree")] 
        # Create Inventory objects for each default item and associate them with the user's profile
        for row, col, item_name in items:
            Inventory.objects.create(
                item=Item.objects.get(name=item_name),
                userprofile=user_profile,
                position={"row": row, "col": col}
            )
    

    inventory_items = user_profile.inventory_items.all()
    context = {"inventory_items": inventory_items}
    # Render the game view template with the context data
    return render(request, "village/village.html", context)

def update_item(request):
    if request.method == "POST":
        # Parse JSON data from the request body
        data = json.loads(request.body)
        # Retrieve the inventory item based on the provided ID
        inventory = Inventory.objects.get(id=data['id'])
        # Set the new position for the inventory item
        inventory.set_position(data['row'], data['col'])
        inventory.save()
        return JsonResponse({'status': 'success'})
    else:
        # If the request method is not POST, return an error response
        return JsonResponse({'status': 'error', 'error': 'Invalid request method'})

