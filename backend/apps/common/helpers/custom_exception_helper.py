# Define a custom exception class named ExceptionError
class ExceptionError(Exception):
    def __init__(self, message):
        # Initialize the custom exception with a user-provided error message
        self.message = message
        # Call the constructor of the base class (Exception) with the provided message
        super().__init__(message)
