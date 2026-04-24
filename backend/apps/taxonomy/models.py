from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.utils.text import slugify

from apps.core.models import TimeStampedModel

User = get_user_model()

dotted_slug_validator = RegexValidator(
    regex=r"^[a-z0-9]+(?:[.-][a-z0-9]+)*$",
    message="Enter a valid dotted slug (lowercase letters, numbers, hyphens, separated by dots).",
)


class Category(TimeStampedModel):
    """Hierarchical category with dot-separated slugs (e.g. internal.fullstack-development.java)."""

    name = models.CharField(max_length=120)
    slug = models.CharField(max_length=255, unique=True, validators=[dotted_slug_validator])
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="children",
    )
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True, default="")

    class Meta:
        ordering = ("slug",)
        verbose_name_plural = "categories"

    def __str__(self) -> str:
        return self.full_path

    @property
    def full_path(self) -> str:
        parts: list[str] = []
        current: Category | None = self
        while current:
            parts.append(current.name)
            current = current.parent
        return " / ".join(reversed(parts))

    @property
    def is_leaf(self) -> bool:
        return not self.children.filter(is_active=True).exists()

    @property
    def depth(self) -> int:
        d = 0
        current = self.parent
        while current:
            d += 1
            current = current.parent
        return d

    def _build_slug(self) -> str:
        parts: list[str] = []
        current: Category | None = self
        while current:
            parts.append(slugify(current.name))
            current = current.parent
        return ".".join(reversed(parts))

    def clean(self) -> None:
        super().clean()

        if self.parent_id and self.parent_id == self.id:
            raise ValidationError({"parent": "A category cannot be its own parent."})

        if self.parent and self.id and self._is_descendant_of(self):
            raise ValidationError({"parent": "This parent creates a cycle."})

        sibling_qs = Category.objects.filter(parent=self.parent)
        if self.parent is None:
            sibling_qs = Category.objects.filter(parent__isnull=True)
        if self.id:
            sibling_qs = sibling_qs.exclude(id=self.id)
        if sibling_qs.filter(name__iexact=self.name).exists():
            raise ValidationError({"name": "Sibling categories must have unique names."})

    def save(self, *args, **kwargs) -> None:
        self.slug = self._build_slug()
        self.full_clean()
        super().save(*args, **kwargs)

    def _is_descendant_of(self, node: Category) -> bool:
        current = self.parent
        while current:
            if current.id == node.id:
                return True
            current = current.parent
        return False


class Tag(TimeStampedModel):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="children",
    )
    is_active = models.BooleanField(default=True)
    main_champion = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="champion_tags",
    )

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name

    @property
    def is_leaf(self) -> bool:
        return not self.children.filter(is_active=True).exists()

    def clean(self) -> None:
        super().clean()

        if self.parent_id and self.parent_id == self.id:
            raise ValidationError({"parent": "A tag cannot be its own parent."})

        if self.parent and self.id and self.parent.is_descendant_of(self):
            raise ValidationError({"parent": "This parent creates a cycle in the hierarchy."})

        sibling_query = Tag.objects.filter(parent=self.parent)
        if self.parent is None:
            sibling_query = Tag.objects.filter(parent__isnull=True)
        if self.id:
            sibling_query = sibling_query.exclude(id=self.id)
        if sibling_query.filter(name__iexact=self.name).exists():
            raise ValidationError({"name": "Sibling tags must have unique names."})

        if self.main_champion_id and not self.is_leaf:
            raise ValidationError({"main_champion": "Champion can only be assigned to leaf tags."})

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = slugify(self.name)
        self.full_clean()
        super().save(*args, **kwargs)

    def is_descendant_of(self, node: "Tag") -> bool:
        current = self.parent
        while current:
            if current.id == node.id:
                return True
            current = current.parent
        return False
