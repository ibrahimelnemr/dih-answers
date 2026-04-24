from django.urls import path

from .views import CategoryListView, CategoryTreeView, TagListView

urlpatterns = [
    path("tags", TagListView.as_view(), name="tag-list"),
    path("categories", CategoryListView.as_view(), name="category-list"),
    path("categories/tree", CategoryTreeView.as_view(), name="category-tree"),
]
