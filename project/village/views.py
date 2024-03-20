from django.shortcuts import render
from django.http import JsonResponse
from game.models import UserProfile, Item, Inventory
import json

def game_view(request):
    user_profile = UserProfile.objects.get(user=request.user)
    inventory_items = user_profile.inventory_items.all()

    if not inventory_items or all(not item.position for item in inventory_items):
        items = [(20, 27, "Palm Tree"),(13, 25, "Palm Tree"),(4, 23, "Palm Tree"),(17, 22, "Palm Tree"),(25, 21, "Palm Tree"),(5, 18, "Palm Tree"),(13, 18, "Hut"),(10, 16, "Vegetable Patch"),(14, 16, "Palm Tree"),(17, 16, "Bikeshed"),(14, 14, "Hut"),(10, 13, "Hut"),(3, 12, "Palm Tree"),(11, 12, "Palm Tree"),(26, 12, "Palm Tree"),(21, 7, "Palm Tree"),(8, 6, "Palm Tree"),(14, 5, "Palm Tree")]
        for row, col, item_name in items:
            Inventory.objects.create(
                item=Item.objects.get(name=item_name),
                userprofile=user_profile,
                position={"row": row, "col": col}
    )
        

    inventory_items = user_profile.inventory_items.all()
    context = {"inventory_items": inventory_items}
    return render(request, "village/village.html", context)

def update_item(request):
    if request.method == "POST":
        data = json.loads(request.body)
        inventory = Inventory.objects.get(id=data['id'])
        inventory.set_position(data['row'], data['col'])
        inventory.save()
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request method'})
