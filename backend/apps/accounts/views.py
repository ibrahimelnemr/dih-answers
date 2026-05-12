from django.contrib.auth import get_user_model, login, logout
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserProfile
from .serializers import LoginSerializer, MeSerializer, RegisterSerializer, UserProfileSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
        return Response(MeSerializer.from_user(user), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return Response(MeSerializer.from_user(user), status=status.HTTP_200_OK)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"detail": "CSRF cookie set."}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response(MeSerializer.from_user(request.user, bio=profile.bio), status=status.HTTP_200_OK)

    def patch(self, request):
        """Update current user's profile (bio, first_name, last_name, email)."""
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)

        allowed_user_fields = {"first_name", "last_name", "email"}
        for field in allowed_user_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save(update_fields=[f for f in allowed_user_fields if f in request.data])

        if "bio" in request.data:
            profile.bio = request.data["bio"]
            profile.save(update_fields=["bio"])

        return Response(MeSerializer.from_user(user, bio=profile.bio), status=status.HTTP_200_OK)


class LeaderboardView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return (
            UserProfile.objects.select_related("user")
            .annotate(
                answer_count=Count("user__answers", distinct=True),
                upvotes_received=Count("user__answers__votes", distinct=True),
            )
            .order_by("-reputation")
        )


class UserProfileDetailView(APIView):
    """Public user profile with questions, answers, and patron categories."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        profile, _ = UserProfile.objects.get_or_create(user=user)

        # Get questions (exclude anonymous)
        questions = list(
            user.questions.filter(is_anonymous=False)
            .select_related("category")
            .order_by("-created_at")[:20]
            .values("id", "title", "created_at", "status")
        )

        # Get answers (exclude anonymous)
        answers = list(
            user.answers.filter(is_anonymous=False)
            .select_related("question")
            .order_by("-created_at")[:20]
            .values("id", "question__id", "question__title", "created_at", "is_accepted")
        )

        patron_categories = list(
            user.patron_categories.values("id", "name", "slug")
        )

        return Response({
            "username": user.username,
            "bio": profile.bio,
            "reputation": profile.reputation,
            "questions_count": user.questions.count(),
            "answers_count": user.answers.count(),
            "patron_categories": patron_categories,
            "questions": questions,
            "answers": answers,
        })
