from django.contrib.auth.models import User
from django.db import models

class Item(models.Model):                           # This is the Items that you will be able to place in your village. They have a name and a price associated with them (which can be $0.00-999.99)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    image = models.ImageField(upload_to='images/', null=True)
    tiles = models.IntegerField(default=1)


    def __str__(self):
        return self.name

class Location(models.Model):                       # These are the locations. Depending on the approach taken these might need to store lat/long or have some kind of associated code instead.
    latitude, longitude = models.FloatField(), models.FloatField()
    # OR models.CharField(max_length=40) in order to store the potential code required. Will determine in Sprint 2.
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=999) # Part of the requirement for "sustainability", will provide info for the user to learn more about a location.
    code = models.CharField(max_length = 6, unique=True, null=True)
    def __str__(self):
        return f"{self.name} ({self.code}): ({self.latitude}, {self.longitude})"

class UserProfile(models.Model):  # Adopted a different method because group member did not want extension of user class
    user = models.OneToOneField(User, on_delete=models.CASCADE)     # Creates an entity-relation between a user and this model.
    currency = models.DecimalField(max_digits=9, decimal_places=2, default=0)  # Currency a user owns (which can be $0.00-9999999.99)
    inventory = models.ManyToManyField(Item, through='Inventory')   # Creates an entity-relation to Inventory to resolve a many-to-many relationship.
    unlocked_locations = models.ManyToManyField(Location)           # Allows locations to be associated with multiple users. 

    def countLoc(self):
        return self.unlocked_locations.count()
    countLoc.short_description = "Locations Unlocked"
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

class Inventory(models.Model):    # Exists to resolve the many-to-many relationship that exists for owned objects.
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    userprofile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='inventory_items')
    position = models.JSONField(default=dict)

    def set_position(self, row, cols):
        self.position = {"row": row, "col": cols}

    def get_position(self):
        return self.position["row"], self.position["col"]
