from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj) -> bool:
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff or obj.created_by_id == request.user.id


class IsQuestionOwner(BasePermission):
    def has_permission(self, request, view) -> bool:
        question = view.get_question()
        return question.created_by_id == request.user.id
