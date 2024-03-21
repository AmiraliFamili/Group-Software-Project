""" tests.py
Sebastian Root - wrote python code"""
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model

class AuthenticationTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        self.signin_url = reverse("signin")
        self.signout_url = reverse("signout")
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username="testuser", password="12345")

    def test_signup_view(self):
        # Ensures a user can sign up, and makes sure this user (with the username) exists
        response = self.client.post(self.signup_url, {
            "username": "newuser",
            "fname": "New",
            "lname": "User",
            "email": "newuser@example.com",
            "pass": "newpassword",
            "confpass": "newpassword"
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(self.User.objects.filter(username="newuser").exists())  # Check user creation

    def test_signin_view(self):
        # Tests if a user can sign in using the credentials made earlier
        response = self.client.post(self.signin_url, {
            "username": "testuser",
            "pass": "12345"
        })
        self.assertEqual(response.status_code, 200)  # Check for a successful login

    def test_signout_view(self):
        # Tests if a user can sign out from the account they are logged into
        self.client.login(username="testuser", password="12345")  # Logs into the user
        response = self.client.get(self.signout_url)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(response.wsgi_request.user.is_authenticated)  # Check user is logged out