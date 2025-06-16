from django.shortcuts import render, redirect
from django.core.mail import send_mail, EmailMessage
from .models import Order
from django.conf import settings
from django.contrib import messages
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Create a logger for email errors
logger = logging.getLogger(__name__)

def send_direct_email(subject, body, to_email, from_email=None):
    """Send email directly via SMTP without using Django's email backend"""
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL
        
    # Create message
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        # Connect to server
        server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        
        # Start TLS
        if settings.EMAIL_USE_TLS:
            server.starttls()
        
        # Login
        server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        
        # Send email
        server.sendmail(from_email, to_email, msg.as_string())
        
        # Disconnect
        server.quit()
        
        return True
    except Exception as e:
        logger.error(f"Direct email error: {str(e)}")
        return False

def order_sheep(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        number_of_sheep = request.POST.get('number_of_sheep')
        weight = request.POST.get('weight')
        cost = request.POST.get('cost')
        requirements = request.POST.get('requirements')
        
        # Create order in database
        order = Order.objects.create(
            name=name,
            email=email,
            phone=phone,
            number_of_sheep=number_of_sheep,
            weight=weight,
            cost=cost,
            requirements=requirements
        )
          # Email content for admin notification
        email_subject = f'New Sheep Order #{order.id} from {name}'
        email_message = f'''
New order received from the Shuddhi Farms website!

Order Details:
--------------
Order ID: {order.id}
Name: {name}
Email: {email}
Phone: {phone}
Number of Sheep: {number_of_sheep}
Weight Range: {weight}
Budget: ₹{cost}
Special Requirements: {requirements}

Please contact the customer soon to confirm their order.
'''
        # Email content for customer confirmation
        customer_subject = 'Your Order Confirmation - Shuddhi Farms'
        customer_message = f'''
Dear {name},

Thank you for your order with Shuddhi Farms!

Your Order Details:
-------------------
Order ID: {order.id}
Number of Sheep: {number_of_sheep}
Weight Range: {weight}
Budget: ₹{cost}
Special Requirements: {requirements}

Our team will contact you shortly to confirm your order and discuss next steps.

Best regards,
The Shuddhi Farms Team
'''        # Try to send emails, but don't fail if there's an error
        try:
            # First try using Django's EmailMessage
            logger.info(f"Attempting to send emails for Order #{order.id} using Django EmailMessage")
            
            # Admin notification
            admin_email = EmailMessage(
                subject=email_subject,
                body=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.DEFAULT_TO_EMAIL],
                reply_to=[email],
            )
            admin_email_sent = admin_email.send(fail_silently=False)
            
            # Customer confirmation
            customer_email = EmailMessage(
                subject=customer_subject,
                body=customer_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email],
                reply_to=[settings.DEFAULT_FROM_EMAIL],
            )
            customer_email_sent = customer_email.send(fail_silently=False)
            
            # Log the results
            logger.info(f"Order #{order.id} Django email status: Admin: {admin_email_sent}, Customer: {customer_email_sent}")
            
        except Exception as e:
            # If Django's EmailMessage fails, try direct SMTP
            logger.warning(f"Django EmailMessage failed for order #{order.id}: {str(e)}")
            logger.info(f"Attempting to send emails for Order #{order.id} using direct SMTP")
            
            # Send admin notification directly
            admin_sent = send_direct_email(
                subject=email_subject, 
                body=email_message, 
                to_email=settings.DEFAULT_TO_EMAIL
            )
            
            # Send customer notification directly
            customer_sent = send_direct_email(
                subject=customer_subject, 
                body=customer_message, 
                to_email=email
            )
            
            # Log the results
            logger.info(f"Order #{order.id} direct SMTP email status: Admin: {admin_sent}, Customer: {customer_sent}")
            
            # If both methods fail, log a critical error
            if not admin_sent and not customer_sent:
                logger.critical(f"All email sending methods failed for Order #{order.id}")
        
        # Always show success message to the user
        messages.success(request, f"Order #{order.id} placed successfully! We've sent you a confirmation email and our team will contact you soon.")
        
        return render(request, 'order_form.html', {'success': True, 'order': order})
    
    return render(request, 'order_form.html')
