from rest_access_policy import AccessPolicy


class PatientAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list", "retrieve", "create", "update", "delete"],
            "principal": {"group": "patients"},
            "effect": "deny"
        },
        {
            "action": ["list", "retrieve", "create", "update"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["not_in_patients_group"]
        }
    ]

    def not_in_patients_group(self, request, view, action) -> bool:
        return "patients" not in request.user.groups.values_list("name", flat=True)

    @classmethod
    def scope_queryset(cls, request, qs):
        user_hospital = request.user.hospital

        # Check if the user is a member of certain groups you want to exclude
        excluded_groups = ["patients"]  # Replace with the actual group names

        if not user_hospital:
            return qs.none()  # Return an empty queryset if the user is not associated with any hospital

        # Check if the user belongs to any of the excluded groups
        if any(group in excluded_groups for group in request.user.groups.values_list("name", flat=True)):
            return qs.none()  # Return an empty queryset if the user is in an excluded group

        return qs
