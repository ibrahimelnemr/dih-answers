from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

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
    permission_classes = [permissions.AllowAny]


class CategoryListView(generics.ListAPIView):
    """Returns all categories flat."""
    queryset = Category.objects.filter(is_active=True).order_by("slug")
    serializer_class = CategoryFlatSerializer
    permission_classes = [permissions.AllowAny]


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


User = get_user_model()


class CategoryPatronView(APIView):
    """Toggle patron status for the current user on a leaf category only."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"detail": "Category not found."}, status=status.HTTP_404_NOT_FOUND)

        if not category.is_leaf:
            return Response(
                {"detail": "Patron status can only be toggled on specific topics (leaf categories)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        if category.patrons.filter(pk=user.pk).exists():
            category.patrons.remove(user)
            return Response({"detail": f"You are no longer a patron of {category.name}.", "is_patron": False})
        else:
            category.patrons.add(user)
            return Response({"detail": f"You are now a patron of {category.name}!", "is_patron": True})
