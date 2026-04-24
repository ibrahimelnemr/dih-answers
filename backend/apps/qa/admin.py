from django.contrib import admin

from .models import Answer, AnswerComment, Question, QuestionComment, QuestionVote


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "status", "created_by", "created_at")
    search_fields = ("title", "body", "created_by__username")
    list_filter = ("status", "category")


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "created_by", "is_accepted", "created_at")
    list_filter = ("is_accepted",)
    search_fields = ("question__title", "body", "created_by__username")


@admin.register(QuestionComment)
class QuestionCommentAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "created_by", "created_at")
    search_fields = ("question__title", "body", "created_by__username")


@admin.register(AnswerComment)
class AnswerCommentAdmin(admin.ModelAdmin):
    list_display = ("id", "answer", "created_by", "created_at")
    search_fields = ("answer__body", "body", "created_by__username")


@admin.register(QuestionVote)
class QuestionVoteAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "user")
    search_fields = ("question__title", "user__username")
