from django.urls import path

from .views import (
    CategoryCreateView,
    CategoryDetailView,
    CategoryListView,
    CategoryTreeView,
    TagCreateView,
    TagDetailView,
    TagListView,
)

urlpatterns = [
    path("tags", TagListView.as_view(), name="tag-list"),
    path("tags/create", TagCreateView.as_view(), name="tag-create"),
    path("tags/<int:pk>", TagDetailView.as_view(), name="tag-detail"),
    path("categories", CategoryListView.as_view(), name="category-list"),
    path("categories/tree", CategoryTreeView.as_view(), name="category-tree"),
    path("categories/create", CategoryCreateView.as_view(), name="category-create"),
    path("categories/<int:pk>", CategoryDetailView.as_view(), name="category-detail"),
]
