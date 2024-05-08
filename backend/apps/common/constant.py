class ErrorMsg:
    INVALID_EMAIL = "Email is not valid"
    USER_NOT_FOUND = "Sorry, user not found"
    NOT_ACTIVATE_ACCOUNT = (
        "Your account is not activated, please contact admin for more details."
    )
    INVALID_CREDENTIALS = "Unable to login with provided credentials."
    EMAIL_PASSWORD_NOT_FOUND = "Must include 'email' and 'password'."
    EVENT_PROCESSOR_NOT_FOUND = "EventProcessor does not exist"
    CURRENT_RUNNING_TASK_ERROR = "Please finish the current event."
    ACCOUNT_NOT_VERIFIED = "Please verify your email address. A verification link has been sent to your email."
    DOCUMENT_NOT_FOUND_FOR_FUND = "Document not found for the given Fund"


class SystemMsg:
    LOGIN_SUCCESS = "Login successfully done."
    UPDATED_SUCCESSFULLY = "Event processor date updated successfully."
    SUCCESSFULLY_REGISTERED = "Successfully registered."
    EMAIL_VERIFIED_SUCCESS = "Email verified successfully."
    EMAIL_VERIFICATION_FAILED = "Email verification failed."

    FUND_LIST_VIEW = "Fund lists"
    FUND_CREATED_SUCCESS = "Fund created successfully."
    FUND_CREATION_ERROR = "Something went wrong or bad request in fund creations."
