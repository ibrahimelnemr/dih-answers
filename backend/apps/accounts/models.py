from django.db import models
from django.contrib.auth.models import User

# Use Django's built-in User model for Phase 0.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, default="")
    reputation = models.IntegerField(default=0)

    def __str__(self):
        return f"Profile for {self.user.username}"
