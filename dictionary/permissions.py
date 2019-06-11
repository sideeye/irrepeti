from rest_framework import permissions


class IsOwnerText(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to read and edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Permissions are only allowed to the owner of the snippet.
        return obj.user == request.user

class IsOwnerTranslation(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to read and edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Permissions are only allowed to the owner of the snippet.
        return obj.original.user == request.user
