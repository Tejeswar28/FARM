"""
Management command to test email configuration.
Usage: python manage.py test_email
"""

from django.core.management.base import BaseCommand
from quadraise.email_utils import test_email_setup


class Command(BaseCommand):
    help = 'Test email configuration by sending a test email'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Testing email configuration...'))
        
        success, message = test_email_setup()
        
        if success:
            self.stdout.write(self.style.SUCCESS(message))
        else:
            self.stdout.write(self.style.ERROR(message))
