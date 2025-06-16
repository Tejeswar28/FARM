from django.core.mail import EmailMessage
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def test_email_setup():
    """
    Test function to verify email sending capabilities.
    Can be run from the Django shell:
    
    from quadraise.email_utils import test_email_setup
    test_email_setup()
    """
    try:
        # Create test email
        subject = "Quad-raise Farm Website - Email Test"
        message = """
        This is a test email from your Quad-raise Farm Website.
        
        If you're receiving this, your email configuration is working correctly!
        
        Current settings:
        - EMAIL_BACKEND: {backend}
        - EMAIL_HOST: {host}
        - DEFAULT_FROM_EMAIL: {from_email}
        """.format(
            backend=settings.EMAIL_BACKEND,
            host=settings.EMAIL_HOST,
            from_email=settings.DEFAULT_FROM_EMAIL
        )
        
        # Send to admin email
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.DEFAULT_TO_EMAIL],
        )
        
        # Send the email
        email.send(fail_silently=False)
        
        logger.info("Test email sent successfully to %s", settings.DEFAULT_TO_EMAIL)
        return True, "Test email sent successfully to {}".format(settings.DEFAULT_TO_EMAIL)
    
    except Exception as e:
        error_message = f"Error sending test email: {str(e)}"
        logger.error(error_message)
        return False, error_message
