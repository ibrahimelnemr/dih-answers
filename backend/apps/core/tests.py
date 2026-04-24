from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


class HealthCheckTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()

    def test_health_endpoint_returns_ok(self) -> None:
        response = self.client.get(reverse("health"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "ok")
