from django.urls import path

from .views import (
    AcceptAnswerView,
    AnswerCommentDetailView,
    AnswerCommentListCreateView,
    AnswerCreateView,
    AnswerDetailView,
    AnswerVoteView,
    QuestionCommentDetailView,
    QuestionCommentListCreateView,
    QuestionDetailView,
    QuestionListCreateView,
    QuestionVoteView,
)

urlpatterns = [
    path("questions", QuestionListCreateView.as_view(), name="question-list-create"),
    path("questions/<int:pk>", QuestionDetailView.as_view(), name="question-detail"),
    path("questions/<int:question_id>/answers", AnswerCreateView.as_view(), name="answer-create"),
    path("answers/<int:pk>", AnswerDetailView.as_view(), name="answer-detail"),
    path(
        "questions/<int:question_id>/answers/<int:answer_id>/accept",
        AcceptAnswerView.as_view(),
        name="answer-accept",
    ),
    path("questions/<int:question_id>/upvote", QuestionVoteView.as_view(), name="question-upvote"),
    path("answers/<int:answer_id>/upvote", AnswerVoteView.as_view(), name="answer-upvote"),
    path(
        "questions/<int:question_id>/comments",
        QuestionCommentListCreateView.as_view(),
        name="question-comment-list-create",
    ),
    path(
        "questions/<int:question_id>/comments/<int:pk>",
        QuestionCommentDetailView.as_view(),
        name="question-comment-detail",
    ),
    path(
        "answers/<int:answer_id>/comments",
        AnswerCommentListCreateView.as_view(),
        name="answer-comment-list-create",
    ),
    path(
        "answers/<int:answer_id>/comments/<int:pk>",
        AnswerCommentDetailView.as_view(),
        name="answer-comment-detail",
    ),
]
