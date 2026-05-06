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


User = get_user_model()


class CategoryPatronView(APIView):
    """Manage patrons for a category. Admin can add/remove; users can self-assign."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        category = Category.objects.get(pk=pk)
        username = request.data.get("username", request.user.username)

        # Only admins can assign others
        if username != request.user.username and not request.user.is_staff:
            return Response(
                {"detail": "Only admins can assign other users as patrons."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = User.objects.filter(username=username).first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        category.patrons.add(user)
        return Response({"detail": f"{username} is now a patron of {category.name}."})

    def delete(self, request, pk):
        category = Category.objects.get(pk=pk)
        username = request.data.get("username", request.user.username)

        if username != request.user.username and not request.user.is_staff:
            return Response(
                {"detail": "Only admins can remove other users as patrons."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = User.objects.filter(username=username).first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        category.patrons.remove(user)
        return Response({"detail": f"{username} removed as patron of {category.name}."})
