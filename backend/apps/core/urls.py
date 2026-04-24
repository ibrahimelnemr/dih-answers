from django.urls import path

from .views import HealthCheckView, SQLConsoleView

urlpatterns = [
    path("health", HealthCheckView.as_view(), name="health"),
    path("api/sql", SQLConsoleView.as_view(), name="sql-console"),
]
