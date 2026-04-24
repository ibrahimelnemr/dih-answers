from __future__ import annotations

from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class Question(TimeStampedModel):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        CLOSED = "closed", "Closed"

    title = models.CharField(max_length=255)
    body = models.TextField()
    category = models.ForeignKey(
        "taxonomy.Category",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="questions",
    )
    tags = models.ManyToManyField("taxonomy.Tag", related_name="questions", blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="questions",
    )

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class QuestionVote(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="votes",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="question_votes",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("question", "user"),
                name="qa_question_unique_upvote",
            )
        ]

    def __str__(self) -> str:
        return f"Upvote by {self.user_id} on question {self.question_id}"


class Answer(TimeStampedModel):
    body = models.TextField()
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="answers",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="answers",
    )
    is_accepted = models.BooleanField(default=False)

    class Meta:
        ordering = ("created_at",)
        constraints = [
            models.UniqueConstraint(
                fields=("question",),
                condition=models.Q(is_accepted=True),
                name="qa_single_accepted_answer_per_question",
            )
        ]

    def __str__(self) -> str:
        return f"Answer #{self.pk} to Question #{self.question_id}"


class AnswerVote(models.Model):
    answer = models.ForeignKey(
        Answer,
        on_delete=models.CASCADE,
        related_name="votes",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="answer_votes",
    )

    class Meta:
        unique_together = ("answer", "user")
        constraints = [
            models.UniqueConstraint(
                fields=("answer", "user"),
                name="qa_answer_unique_upvote",
            )
        ]

    def __str__(self) -> str:
        return f"Upvote by {self.user_id} on answer {self.answer_id}"


class QuestionComment(TimeStampedModel):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="question_comments",
    )
    body = models.TextField()

    class Meta:
        ordering = ("created_at",)

    def __str__(self) -> str:
        return f"Comment #{self.pk} on question {self.question_id}"


class AnswerComment(TimeStampedModel):
    answer = models.ForeignKey(
        Answer,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="answer_comments",
    )
    body = models.TextField()

    class Meta:
        ordering = ("created_at",)

    def __str__(self) -> str:
        return f"Comment #{self.pk} on answer {self.answer_id}"
