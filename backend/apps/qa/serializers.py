from __future__ import annotations

from rest_framework import serializers

from apps.taxonomy.models import Category, Tag

from .models import Answer, AnswerComment, AnswerVote, Question, QuestionComment, QuestionVote


class TagSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name", "slug")


class CategorySummarySerializer(serializers.ModelSerializer):
    full_path = serializers.CharField(read_only=True)

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "full_path")


class AnswerSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source="created_by.username", read_only=True)
    vote_count = serializers.IntegerField(source="votes.count", read_only=True)
    has_upvoted = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = (
            "id",
            "body",
            "question",
            "created_by",
            "is_accepted",
            "created_at",
            "updated_at",
            "vote_count",
            "has_upvoted",
        )
        read_only_fields = ("question", "created_by", "is_accepted")

    def get_has_upvoted(self, obj: Answer) -> bool:
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return False
        return obj.votes.filter(user=request.user).exists()


class QuestionCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source="created_by.username", read_only=True)

    class Meta:
        model = QuestionComment
        fields = ("id", "question", "body", "created_by", "created_at", "updated_at")
        read_only_fields = ("question", "created_by")


class AnswerCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source="created_by.username", read_only=True)

    class Meta:
        model = AnswerComment
        fields = ("id", "answer", "body", "created_by", "created_at", "updated_at")
        read_only_fields = ("answer", "created_by")


class AnswerWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ("body",)


class QuestionSerializer(serializers.ModelSerializer):
    tags = TagSummarySerializer(many=True, read_only=True)
    category = CategorySummarySerializer(read_only=True)
    created_by = serializers.CharField(source="created_by.username", read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    comments = QuestionCommentSerializer(many=True, read_only=True)
    vote_count = serializers.IntegerField(source="votes.count", read_only=True)
    has_upvoted = serializers.SerializerMethodField()
    answer_count = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = (
            "id",
            "title",
            "body",
            "status",
            "category",
            "tags",
            "created_by",
            "answers",
            "comments",
            "vote_count",
            "has_upvoted",
            "answer_count",
            "created_at",
            "updated_at",
        )

    def get_has_upvoted(self, obj: Question) -> bool:
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return False
        return obj.votes.filter(user=request.user).exists()

    def get_answer_count(self, obj: Question) -> int:
        return obj.answers.count()


class QuestionWriteSerializer(serializers.ModelSerializer):
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(is_active=True),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Question
        fields = ("title", "body", "status", "tag_ids", "category_id")

    def validate_tag_ids(self, tags: list[Tag]) -> list[Tag]:
        if not tags:
            return tags

        inactive_ids = [tag.id for tag in tags if not tag.is_active]
        if inactive_ids:
            raise serializers.ValidationError(
                f"Tags must be active. Invalid tag ids: {inactive_ids}"
            )

        non_leaf_ids = [
            tag.id for tag in tags if tag.children.filter(is_active=True).exists()
        ]
        if non_leaf_ids:
            raise serializers.ValidationError(
                f"Only leaf tags are allowed. Invalid tag ids: {non_leaf_ids}"
            )

        return tags

    def create(self, validated_data: dict) -> Question:
        tags = validated_data.pop("tag_ids", [])
        category = validated_data.pop("category_id", None)
        question = Question.objects.create(
            created_by=self.context["request"].user,
            category=category,
            **validated_data,
        )
        if tags:
            question.tags.set(tags)
        return question

    def update(self, instance: Question, validated_data: dict) -> Question:
        tags = validated_data.pop("tag_ids", None)
        category = validated_data.pop("category_id", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if category is not None:
            instance.category = category
        instance.save()

        if tags is not None:
            instance.tags.set(tags)

        return instance
