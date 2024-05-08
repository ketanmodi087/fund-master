from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail,
)


class SendMail:
    @staticmethod
    def send_email(message):
        sg = SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code

    @staticmethod
    def send_verification_email(verify_link, user_data):
        # Create a verification email message and send it
        message = Mail(
            from_email=settings.EMAIL_HOST_USER,
            to_emails=user_data.email,
            subject="Verify Your Account",
        )
        message.template_id = settings.VERIFY_YOUR_ACCOUNT_TEMPLATE_ID
        message.dynamic_template_data = {
            "username": user_data.get_full_name(),
            "verification_link": verify_link,
        }
        SendMail.send_email(message=message)
