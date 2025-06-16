from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
import json
from .models import GalleryItem
from django import forms
from users.models import UserProfile
from PIL import Image
from django.conf import settings
import os
from django.core.paginator import Paginator

def gallery_home(request):
    all_items = GalleryItem.objects.all().order_by('-uploaded_at')
    
    # Add pagination for grid view
    page = request.GET.get('page', 1)
    paginator = Paginator(all_items, 12)  # Show 12 items per page
    items = paginator.get_page(page)
    
    return render(request, 'gallery_home.html', {
        'items': items,
        'total_items': all_items.count(),
    })

class MediaForm(forms.ModelForm):
    class Meta:
        model = GalleryItem
        fields = ['title', 'description', 'type', 'file', 'video_url']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter a title'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Enter a description (optional)', 'rows': 4}),
            'type': forms.Select(attrs={'class': 'form-control'}),
            'file': forms.FileInput(attrs={'class': 'form-control', 'accept': 'image/*'}),
            'video_url': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'Enter YouTube or Vimeo URL'}),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        media_type = cleaned_data.get('type')
        file = cleaned_data.get('file')
        video_url = cleaned_data.get('video_url')
        
        if media_type == 'image' and not file:
            raise forms.ValidationError("Please upload an image file.")
        
        if media_type == 'video' and not video_url:
            raise forms.ValidationError("Please provide a video URL.")
        
        # Validate image file
        if media_type == 'image' and file:
            # Check file extension
            ext = os.path.splitext(file.name)[1].lower()
            valid_extensions = ['.jpg', '.jpeg', '.png', '.webp']
            if ext not in valid_extensions:
                raise forms.ValidationError(f"Unsupported file format. Please use: {', '.join(valid_extensions)}")
            
            # Check file size (max 10MB)
            if file.size > 10 * 1024 * 1024:
                raise forms.ValidationError("File size cannot exceed 10MB.")
            
            # Check image dimensions
            img = Image.open(file)
            min_dimension = 800
            if img.width < min_dimension or img.height < min_dimension:
                raise forms.ValidationError(f"Image dimensions should be at least {min_dimension}x{min_dimension} pixels.")
        
        return cleaned_data

@login_required
def add_media(request):
    # Check if user has admin role
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        if user_profile.role != 'admin' and not request.user.is_superuser:
            raise PermissionDenied("You do not have permission to add media. Only admins can add media.")
    except UserProfile.DoesNotExist:
        if not request.user.is_superuser:
            raise PermissionDenied("You do not have permission to add media. Only admins can add media.")
    
    if request.method == 'POST':
        form = MediaForm(request.POST, request.FILES)
        if form.is_valid():
            media = form.save(commit=False)
            media.uploaded_by = request.user
            media.save()
            return redirect('gallery_home')
    else:
        form = MediaForm()
    
    return render(request, 'add_media.html', {'form': form})

def view_image(request, pk):
    """View a single image in full size with a lightbox effect"""
    try:
        image = GalleryItem.objects.get(pk=pk, type='image')
        return render(request, 'view_image.html', {'image': image})
    except GalleryItem.DoesNotExist:
        return redirect('gallery_home')

@require_POST
@csrf_protect
def add_youtube_video(request):
    """API endpoint to add a YouTube video from the quick add form"""
    try:
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'error': 'You must be logged in to add videos'}, status=403)
        
        # Check if user has permission (admin or specified role)
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            if user_profile.role != 'admin' and not request.user.is_superuser:
                return JsonResponse({'success': False, 'error': 'Only admins can add videos'}, status=403)
        except UserProfile.DoesNotExist:
            if not request.user.is_superuser:
                return JsonResponse({'success': False, 'error': 'Only admins can add videos'}, status=403)
        
        # Parse request data with error handling
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
            
        url = data.get('url', '').strip()
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        
        # Validate inputs
        if not url or not title:
            return JsonResponse({'success': False, 'error': 'URL and title are required'}, status=400)
        
        # Extract YouTube video ID and create embed URL
        video_id = GalleryItem.extract_youtube_id(url)
        if not video_id:
            return JsonResponse({'success': False, 'error': 'Invalid YouTube URL'}, status=400)
        
        embed_url = f'https://www.youtube.com/embed/{video_id}'
        
        # Create new gallery item
        video = GalleryItem(
            title=title,
            description=description,
            video_url=embed_url,
            type='video',
            uploaded_by=request.user
        )
        video.save()
        
        return JsonResponse({
            'success': True, 
            'video_id': video.id,
            'message': 'Video added successfully',
            'reload': True
        })
    
    except Exception as e:
        import traceback
        print(f"Error in add_youtube_video: {str(e)}")
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@require_POST
@csrf_protect
def suggest_video(request):
    """Endpoint for admins to suggest videos"""
    try:
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'error': 'You must be logged in to suggest videos'}, status=403)
        
        # Check if user has permission (admin or specified role)
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            if user_profile.role != 'admin' and not request.user.is_superuser:
                return JsonResponse({'success': False, 'error': 'Only admins can suggest videos'}, status=403)
        except UserProfile.DoesNotExist:
            if not request.user.is_superuser:
                return JsonResponse({'success': False, 'error': 'Only admins can suggest videos'}, status=403)
        
        # Parse request data with error handling
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
            
        url = data.get('url', '').strip()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        
        # Validate inputs
        if not url:
            return JsonResponse({'success': False, 'error': 'URL is required'}, status=400)
        
        # Extract YouTube video ID with error handling
        video_id = GalleryItem.extract_youtube_id(url)
        if not video_id:
            return JsonResponse({'success': False, 'error': 'Invalid YouTube URL'}, status=400)
        
        # Save the suggestion to the database
        from .models import SuggestedVideo
        
        # Get the client IP address
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
            
        # Create the suggestion
        suggestion = SuggestedVideo(
            url=url,
            video_id=video_id,
            name=name,
            email=email,
            ip_address=ip
        )
        suggestion.save()
        
        # Also send an email notification to admins
        from django.core.mail import send_mail
        from django.conf import settings
        
        try:
            admin_emails = [admin[1] for admin in settings.ADMINS]
            if admin_emails:
                subject = 'New video suggestion for Shuddhi Farms'
                message = f"""
                A visitor has suggested a video for the farm website:
                
                Video URL: {url}
                YouTube ID: {video_id}
                Suggested by: {name or 'Anonymous'}
                Contact email: {email or 'Not provided'}
                IP Address: {ip}
                
                Preview: https://www.youtube.com/watch?v={video_id}
                
                To add this video to the website, log in as an admin and use the quick add form.
                """
                
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    admin_emails,
                    fail_silently=True,
                )
        except Exception as e:
            # Log the error but don't stop the response
            print(f"Error sending email notification: {e}")
        
        return JsonResponse({
            'success': True,
            'message': 'Thank you for your suggestion! Our team will review it soon.'
        })
    
    except Exception as e:
        import traceback
        print(f"Error in suggest_video: {str(e)}")
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@login_required
def delete_media(request, pk):
    """Delete a gallery item (image or video)"""
    # Check if user has admin role
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        if user_profile.role != 'admin' and not request.user.is_superuser:
            raise PermissionDenied("You do not have permission to delete media. Only admins can delete media.")
    except UserProfile.DoesNotExist:
        if not request.user.is_superuser:
            raise PermissionDenied("You do not have permission to delete media. Only admins can delete media.")
    
    try:
        item = GalleryItem.objects.get(pk=pk)
        
        # If it's an image, delete the files from storage
        if item.type == 'image':
            # Delete the main image file
            if item.file and os.path.isfile(item.file.path):
                os.remove(item.file.path)
            
            # Delete the thumbnail if it exists
            if item.thumbnail and os.path.isfile(item.thumbnail.path):
                os.remove(item.thumbnail.path)
        
        # Delete the database record
        item.delete()
        
        # Check if this is an AJAX request
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': True, 'message': f"{item.type.capitalize()} successfully deleted"})
        
        # Regular request - redirect back to the gallery
        return redirect('gallery_home')
        
    except GalleryItem.DoesNotExist:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'error': 'Item not found'}, status=404)
        return redirect('gallery_home')
    
    except Exception as e:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
        return redirect('gallery_home')
