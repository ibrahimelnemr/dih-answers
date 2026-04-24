from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("apps.accounts.urls")),
    path("", include("apps.qa.urls")),
    path("", include("apps.taxonomy.urls")),
    path("", include("apps.core.urls")),
]
