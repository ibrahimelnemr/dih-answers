from __future__ import annotations

from rest_framework import serializers

from .models import Category, Tag


class CategorySerializer(serializers.ModelSerializer):
    full_path = serializers.CharField(read_only=True)
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "parent_id", "is_leaf", "is_active", "description", "full_path", "depth", "children")

    def get_children(self, obj: Category) -> list[dict]:
        children = obj.children.filter(is_active=True).order_by("name")
        return CategorySerializer(children, many=True).data


class CategoryFlatSerializer(serializers.ModelSerializer):
    full_path = serializers.CharField(read_only=True)

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "parent_id", "is_leaf", "is_active", "full_path", "depth")


class TagSerializer(serializers.ModelSerializer):
    path = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ("id", "name", "slug", "parent_id", "is_leaf", "is_active", "path")

    def get_path(self, obj: Tag) -> str:
        current = obj
        parts: list[str] = []
        while current:
            parts.append(current.name)
            current = current.parent
        return " / ".join(reversed(parts))
