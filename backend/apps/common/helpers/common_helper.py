from django.db.models import Q


def get_common_queryset(request, queryset, search_fields):
    # Add your search filter conditions here
    if search_query := request.query_params.get("search", None):
        search_filters = Q()
        for field in search_fields:
            search_filters |= Q(**{f"{field}__icontains": search_query})
        queryset = queryset.filter(search_filters)

    # Apply ordering filter
    if ordering_field := request.query_params.get("ordering", None):
        queryset = queryset.order_by(ordering_field)

    return queryset
