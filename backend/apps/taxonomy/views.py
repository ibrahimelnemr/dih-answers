from rest_framework import generics

from .models import Category, Tag
from .serializers import CategoryFlatSerializer, CategorySerializer, TagSerializer


class CategoryTreeView(generics.ListAPIView):
    """Returns root categories with nested children."""
    queryset = Category.objects.filter(is_active=True, parent__isnull=True).order_by("name")
    serializer_class = CategorySerializer


class CategoryListView(generics.ListAPIView):
    """Returns all categories flat."""
    queryset = Category.objects.filter(is_active=True).order_by("slug")
    serializer_class = CategoryFlatSerializer


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.filter(is_active=True)
    serializer_class = TagSerializer
