from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from .models import UserProfile

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, default="")
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_username(self, value: str) -> str:
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def create(self, validated_data: dict):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        username = attrs.get("username")
        password = attrs.get("password")
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid username or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")
        attrs["user"] = user
        return attrs


class MeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)

    @staticmethod
    def from_user(user) -> dict:
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_staff": user.is_staff,
        }


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    questions_count = serializers.SerializerMethodField()
    answers_count = serializers.SerializerMethodField()
    votes_received = serializers.SerializerMethodField()
    patron_categories = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ("bio", "reputation", "username", "questions_count", "answers_count", "votes_received", "patron_categories")

    def get_questions_count(self, obj):
        return obj.user.questions.count()

    def get_answers_count(self, obj):
        return obj.user.answers.count()

    def get_votes_received(self, obj):
        question_votes = sum(q.votes.count() for q in obj.user.questions.all())
        answer_votes = sum(a.votes.count() for a in obj.user.answers.all())
        return question_votes + answer_votes

    def get_patron_categories(self, obj):
        return list(obj.user.patron_categories.values_list("name", flat=True))
