import sys
import traceback

from rest_framework import status
from rest_framework.response import Response


class RequiredParameterValidator:
    def __init__(self, request, required_parameters, api_class_name):
        # Initialize the validator with the request, required parameters, and API class name
        self.request = request
        self.required_parameters = required_parameters
        self.api_class_name = api_class_name.lower()

    def validate(self):
        # Check for missing parameters in the request data
        if missing_parameters := [
            parameter
            for parameter in self.required_parameters
            if parameter not in self.request.data
        ]:
            # If missing parameters are found, return False and the list of missing parameters
            return False, missing_parameters

        # If all required parameters are present, return True and None
        return True, None


# Decorator function for tracking and handling errors in API views
def track_error(validate_api_parameters=None):
    def decorator(view_func):
        def wrapper(self, request, *args, **kwargs):
            # Get the name of the API class
            api_class_name = self.__class__.__name__
            try:
                # Validate API parameters if required
                if validate_api_parameters:
                    validator = RequiredParameterValidator(
                        request, validate_api_parameters, api_class_name
                    )
                    is_valid, missing_parameters = validator.validate()
                    if not is_valid:
                        # If validation fails, return a response with a 406 status code
                        return Response(
                            data={
                                "error": True,
                                "data": [],
                                "message": f"Missing parameters: {', '.join(missing_parameters)}",
                            },
                            status=status.HTTP_406_NOT_ACCEPTABLE,
                        )

                # If validation passes, execute the original view function
                return view_func(self, request, *args, **kwargs)

            except Exception as e:
                # Handle and track exceptions, returning a formatted response
                tb = traceback.extract_tb(sys.exc_info()[2])
                error_file, error_line, function_name, text = tb[-1]
                error_message = "An error occurred in file '{}' at line {}: '{}' in function '{}'".format(
                    error_file, error_line, str(e), function_name
                )
                if "/query.py" in error_message:
                    error_message = traceback.format_exc()

                return Response(
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                    data={
                        "error": True,
                        "data": [],
                        "message": str(e),
                        "exc_message": error_message,
                    },
                )

        return wrapper

    return decorator
