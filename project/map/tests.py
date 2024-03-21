from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from game.models import Location, Item, Inventory

class MapViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.map_url = reverse("map_index")

    def test_map_view(self):
        response = self.client.get(self.map_url)
        self.assertEqual(response.status_code, 200)

class CodeEntryViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.code_entry_url = reverse("code_entry")
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username="testuser", password="12345")
        self.location = Location.objects.create(name="Test Location", latitude=50.7352622, longitude=-3.5355904, code="TEST")
        self.item = Item.objects.create(name="Test Item", price=50.00, image="media\images\bikeshedtrp.png")

    def test_code_entry_view(self):
        self.client.login(username="testuser", password="12345")
        response = self.client.post(self.code_entry_url, {"code": "TESTLOC"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(self.user.userprofile.unlocked_locations.filter(code="TESTLOC").exists())

    def test_code_entry_view(self):
        self.client.login(username="testuser", password="12345")
        response = self.client.post(self.code_entry_url, {"code": "TEST"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(self.user.userprofile.unlocked_locations.filter(code="TEST").exists())
        self.assertTrue(Inventory.objects.filter(userprofile=self.user.userprofile).exists())