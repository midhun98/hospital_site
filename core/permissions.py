from rest_framework import permissions

class AdminGroupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='admin').exists()
