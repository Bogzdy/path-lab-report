from rest_framework.permissions import BasePermission, SAFE_METHODS


class ReportCurrentPatientViewPermission(BasePermission):
    message = "Don't have permission to view this report."

    def has_object_permission(self, request, view, obj):
        print(f"ReportCurrentPatientViewPermission - {obj}")
        if request.method in SAFE_METHODS:
            print(f"user ={type(request.user)} '{request.user}'  obj.patient {type(obj.patient)} '{obj.patient}'")
            print(f"Statement = {request.user == obj.patient}")
            if request.user is obj.patient:
                return True

    def has_permission(self, request, view):
        print(f'request - {request.user}')
        print(f'view - {view}')
        return True
