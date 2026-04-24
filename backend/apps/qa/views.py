from django.db import models, transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Answer,
    AnswerComment,
    AnswerVote,
    Question,
    QuestionComment,
    QuestionVote,
)
from .permissions import IsOwnerOrAdmin, IsQuestionOwner
from .serializers import (
    AnswerCommentSerializer,
    AnswerSerializer,
    AnswerWriteSerializer,
    QuestionCommentSerializer,
    QuestionSerializer,
    QuestionWriteSerializer,
)


class QuestionCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionCommentSerializer

    def get_queryset(self):
        question_id = self.kwargs["question_id"]
        return QuestionComment.objects.filter(question_id=question_id).select_related("created_by")

    def perform_create(self, serializer):
        question = get_object_or_404(Question, pk=self.kwargs["question_id"])
        serializer.save(question=question, created_by=self.request.user)


class AnswerCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = AnswerCommentSerializer

    def get_queryset(self):
        answer_id = self.kwargs["answer_id"]
        return AnswerComment.objects.filter(answer_id=answer_id).select_related("created_by")

    def perform_create(self, serializer):
        answer = get_object_or_404(Answer, pk=self.kwargs["answer_id"])
        serializer.save(answer=answer, created_by=self.request.user)


class QuestionCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionCommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        question_id = self.kwargs["question_id"]
        return QuestionComment.objects.filter(question_id=question_id).select_related("created_by")


class AnswerCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AnswerCommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        answer_id = self.kwargs["answer_id"]
        return AnswerComment.objects.filter(answer_id=answer_id).select_related("created_by")


class QuestionListCreateView(generics.ListCreateAPIView):
    queryset = (
        Question.objects.select_related("created_by", "category")
        .prefetch_related("tags", "answers", "comments", "votes")
    )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return QuestionSerializer
        return QuestionWriteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.save()
        response_serializer = QuestionSerializer(question, context=self.get_serializer_context())
        return Response(response_serializer.data, status=201)

    def get_queryset(self):
        queryset = super().get_queryset()
        q = self.request.query_params.get("q")
        tag_ids = self.request.query_params.getlist("tag_ids")
        category_id = self.request.query_params.get("category_id")
        category_slug = self.request.query_params.get("category_slug")
        if q:
            queryset = queryset.filter(models.Q(title__icontains=q) | models.Q(body__icontains=q))
        if tag_ids:
            queryset = queryset.filter(tags__in=tag_ids).distinct()
        if category_id:
            queryset = queryset.filter(
                models.Q(category_id=category_id) | models.Q(category__slug__startswith=f"{category_id}.")
            )
        if category_slug:
            queryset = queryset.filter(
                models.Q(category__slug=category_slug) | models.Q(category__slug__startswith=f"{category_slug}.")
            )
        return queryset.order_by("-created_at")


class QuestionDetailView(generics.RetrieveUpdateAPIView):
    queryset = (
        Question.objects.select_related("created_by", "category")
        .prefetch_related("tags", "answers", "comments", "answers__comments", "votes")
    )
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return QuestionSerializer
        return QuestionWriteSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        question = serializer.save()
        response_serializer = QuestionSerializer(question, context=self.get_serializer_context())
        return Response(response_serializer.data)


class AnswerCreateView(generics.CreateAPIView):
    serializer_class = AnswerWriteSerializer

    def get_question(self) -> Question:
        return get_object_or_404(Question, pk=self.kwargs["question_id"])

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answer = serializer.save(
            question=self.get_question(),
            created_by=request.user,
        )
        response_serializer = AnswerSerializer(answer, context=self.get_serializer_context())
        return Response(response_serializer.data, status=201)


class AnswerDetailView(generics.RetrieveUpdateAPIView):
    queryset = Answer.objects.select_related("question", "created_by").prefetch_related("votes")
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return AnswerSerializer
        return AnswerWriteSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        answer = serializer.save()
        response_serializer = AnswerSerializer(answer, context=self.get_serializer_context())
        return Response(response_serializer.data)


class AnswerVoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, answer_id: int):
        answer = get_object_or_404(Answer, pk=answer_id)

        if answer.created_by_id == request.user.id:
            return Response(
                {"detail": "You cannot upvote your own answer."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        vote, created = AnswerVote.objects.get_or_create(answer=answer, user=request.user)
        if not created:
            return Response({"detail": "You already upvoted this answer."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AnswerSerializer(answer, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AcceptAnswerView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsQuestionOwner]

    def get_question(self) -> Question:
        return get_object_or_404(Question, pk=self.kwargs["question_id"])

    def post(self, request, question_id: int, answer_id: int):
        question = self.get_question()
        answer = get_object_or_404(Answer, pk=answer_id, question=question)

        with transaction.atomic():
            Answer.objects.filter(question=question, is_accepted=True).update(is_accepted=False)
            answer.is_accepted = True
            answer.save(update_fields=["is_accepted", "updated_at"])

        response_serializer = AnswerSerializer(answer)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class QuestionVoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, question_id: int):
        question = get_object_or_404(Question, pk=question_id)

        if question.created_by_id == request.user.id:
            return Response(
                {"detail": "You cannot upvote your own question."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        vote, created = QuestionVote.objects.get_or_create(question=question, user=request.user)
        if not created:
            return Response({"detail": "You already upvoted this question."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = QuestionSerializer(question, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
