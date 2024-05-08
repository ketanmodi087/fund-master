import contextlib

from rest_framework import pagination


class OffsetPagination(pagination.PageNumberPagination):
    """
    Custom pagination class to specify the number of results per page.
    This class specifies 10 results per page as default if page size is defined then gives result based on that.
    """

    offset = 10

    def get_page_size(self, request):
        offset = request.query_params.get("offset")
        if offset is not None:
            with contextlib.suppress(ValueError):
                offset = int(offset)
                if offset > 0:
                    return offset
        return self.offset
