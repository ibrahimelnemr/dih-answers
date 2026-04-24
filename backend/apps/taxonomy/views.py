from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import Category, Tag
from .serializers import (
    CategoryFlatSerializer,
    CategorySerializer,
    CategoryWriteSerializer,
    TagSerializer,
    TagWriteSerializer,
)


class CategoryTreeView(generics.ListAPIView):
    """Returns root categories with nested children."""
    queryset = Category.objects.filter(is_active=True, parent__isnull=True).order_by("name")
    serializer_class = CategorySerializer


class CategoryListView(generics.ListAPIView):
    """Returns all categories flat."""
    queryset = Category.objects.filter(is_active=True).order_by("slug")
    serializer_class = CategoryFlatSerializer


class CategoryCreateView(generics.CreateAPIView):
    """Admin-only: create a new category."""
    serializer_class = CategoryWriteSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin-only: update or delete a category."""
    queryset = Category.objects.all()
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return CategoryFlatSerializer
        return CategoryWriteSerializer


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.filter(is_active=True)
    serializer_class = TagSerializer


class TagCreateView(generics.CreateAPIView):
    """Admin-only: create a new tag."""
    serializer_class = TagWriteSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin-only: update or delete a tag."""
    queryset = Tag.objects.all()
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return TagSerializer
        return TagWriteSerializer
