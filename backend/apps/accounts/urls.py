from django.urls import path

from .views import CsrfTokenView, LeaderboardView, LoginView, LogoutView, MeView, RegisterView, UserProfileDetailView

urlpatterns = [
    path("csrf", CsrfTokenView.as_view(), name="csrf"),
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("logout", LogoutView.as_view(), name="logout"),
    path("me", MeView.as_view(), name="me"),
    path("leaderboard", LeaderboardView.as_view(), name="leaderboard"),
    path("users/<str:username>", UserProfileDetailView.as_view(), name="user-profile"),
]
