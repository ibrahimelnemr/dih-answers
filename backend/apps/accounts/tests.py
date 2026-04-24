from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


class AuthApiTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient(enforce_csrf_checks=False)
        self.user_model = get_user_model()
        self.user = self.user_model.objects.create_user(
            username="alice",
            password="secret123",
            email="alice@example.com",
        )

    def test_login_with_valid_credentials(self) -> None:
        response = self.client.post(
            reverse("login"),
            {"username": "alice", "password": "secret123"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "alice")

    def test_csrf_endpoint_sets_cookie(self) -> None:
        response = self.client.get(reverse("csrf"))

        self.assertEqual(response.status_code, 200)
        self.assertIn("csrftoken", response.cookies)

    def test_login_with_invalid_credentials(self) -> None:
        response = self.client.post(
            reverse("login"),
            {"username": "alice", "password": "wrong"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    def test_me_requires_authentication(self) -> None:
        response = self.client.get(reverse("me"))

        self.assertEqual(response.status_code, 403)

    def test_me_for_authenticated_user(self) -> None:
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse("me"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "alice")

    def test_logout_returns_204(self) -> None:
        self.client.force_authenticate(user=self.user)

        response = self.client.post(reverse("logout"), format="json")

        self.assertEqual(response.status_code, 204)
