from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaffPermission(BasePermission):
    message = "Access denied. Staff access only."
    SAFE_ACTIONS = {'partial_update', 'destroy'}

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if request.user.is_staff and request.user.id == obj.doctor_id and view.action in self.SAFE_ACTIONS:
            return True
        return False

    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        if request.user.is_authenticated and view.action == 'get_logged_user_reports':
            return True
        return False
