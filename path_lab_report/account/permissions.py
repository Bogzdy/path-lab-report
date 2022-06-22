from rest_framework.permissions import BasePermission


class IsOwnerOrStaffPermission(BasePermission):
    message = "Access denied. You have to be the owner of the account or staff."
    SAFE_ACTIONS = {'retrieve', 'destroy', 'partial_update'}

    def has_object_permission(self, request, view, obj):
        if request.user == obj or request.user.is_staff:
            return True
        return False

    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        elif view.action in self.SAFE_ACTIONS:
            return True
        return False


class IsOwnerOrSuperuserPermission(BasePermission):
    message = "Access denied. You have to be the owner of the account or superuser."
    SAFE_ACTIONS = {'retrieve', 'destroy', 'partial_update'}

    def has_object_permission(self, request, view, obj):
        if request.user == obj or request.user.is_superuser:
            return True
        return False

    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        elif request.user.is_staff and view.action in self.SAFE_ACTIONS:
            return True
        return False
