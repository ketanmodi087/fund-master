from rest_framework import status
from rest_framework.response import Response


# Define a utility function for generating consistent API responses
def return_response(
    message, data={}, status_code=status.HTTP_200_OK, error=False, extra_field=None
):
    # Create a dictionary to hold the response data with a "data" key
    response_data = {"data": data}

    # Check if there are additional fields to be included in the response
    if extra_field:
        # Iterate through the extra fields and add them to the response data
        for key, value in extra_field.items():
            response_data[key] = value

    # Add the provided message, error status, and HTTP status code to the response data
    response_data["message"] = message
    response_data["error"] = error

    # Return a Response object with the formatted response data and status code
    return Response(response_data, status=status_code)
