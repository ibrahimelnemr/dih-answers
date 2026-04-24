from django.core.exceptions import ValidationError
from django.test import TestCase

from .models import Tag


class TagModelTests(TestCase):
    def test_cannot_make_tag_its_own_parent(self) -> None:
        tag = Tag.objects.create(name="AI & Data", slug="ai-data")
        tag.parent = tag

        with self.assertRaises(ValidationError):
            tag.save()

    def test_cannot_create_cycle_in_hierarchy(self) -> None:
        root = Tag.objects.create(name="AI & Data", slug="ai-data")
        child = Tag.objects.create(name="Visualization", slug="visualization", parent=root)
        grandchild = Tag.objects.create(
            name="Power BI",
            slug="power-bi",
            parent=child,
        )

        root.parent = grandchild
        with self.assertRaises(ValidationError):
            root.save()

    def test_sibling_names_must_be_unique_case_insensitive(self) -> None:
        root = Tag.objects.create(name="AI & Data", slug="ai-data")
        Tag.objects.create(name="Visualization", slug="visualization", parent=root)

        with self.assertRaises(ValidationError):
            Tag.objects.create(name="visualization", slug="viz-2", parent=root)
