""" tests.py
Sebastian Root - wrote python code"""
from django.test import TestCase
from django.contrib.auth.models import User
from .models import Item, UserProfile
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import IntegrityError


class ItemModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Sets up testing data for this test
        Item.objects.create(name="Test Item", price=244.22, tiles=1)

    def test_name_label(self):
        # Single test to check that the fields are correctly named
        item = Item.objects.get(id=1)
        field_label = item._meta.get_field("name").verbose_name
        self.assertEquals(field_label, "name")

    def test_item_price(self):
        item = Item.objects.get(id=1)
        self.assertEquals(item.price, Decimal("244.22"))

    def test_long_name(self):
        Item.objects.create(name="x" * 200, price=50.00)
        item = Item.objects.get(id=2)
        self.assertEquals(item.name, "x"*200)

    def test_null_name(self):
        with self.assertRaises(IntegrityError):
            Item.objects.create(name=None, price=0.00)

class UserProfileSignalTest(TestCase):
    def test_create_user_profile(self):
        # This tests the signals, ensuring that the user does have a profile correctly associated to it
        user = User.objects.create_user(username="testuser", password="12345")
        user.save()

        self.assertIsInstance(UserProfile.objects.get(user=user), UserProfile)

    def test_save_user_profile(self):
        # Ensuring a user's profile does save when their username is adjusted.
        user = User.objects.create_user(username="testuser", password="12345")
        user.save()

        user.username = "newusername"
        user.save()

        self.assertEquals(UserProfile.objects.get(user=user).user.username, "newusername")

class UserProfileModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(username="testuser", password="12345")

    def test_currency_label(self):
        # This test mostly exists just to make sure that a user does correctly have a UserProfile attached
        userprofile = UserProfile.objects.get(id=1)
        field_label = userprofile._meta.get_field("currency").verbose_name
        self.assertEquals(field_label, "currency")

    def test_countLoc_method(self):
        # Tests to make sure the countLoc method actually works, it should start a user with 0 unlocked locations
        userprofile = UserProfile.objects.get(id=1)
        self.assertEquals(userprofile.countLoc(), 0)