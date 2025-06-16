from django.shortcuts import render
from gallery.models import GalleryItem

def home(request):
    # Get the latest images and videos for the homepage
    images = GalleryItem.objects.filter(type='image').order_by('-uploaded_at')[:4]
    videos = GalleryItem.objects.filter(type='video').order_by('-uploaded_at')[:6]  # Increased to show more videos
    
    # Check if user has admin rights for the video form
    show_video_form = False
    if request.user.is_authenticated:
        if request.user.is_superuser:
            show_video_form = True
        else:
            try:
                from users.models import UserProfile
                user_profile = UserProfile.objects.get(user=request.user)
                if user_profile.role == 'admin':
                    show_video_form = True
            except:
                pass
    
    context = {
        'images': images,
        'videos': videos,
        'show_video_form': show_video_form
    }
    
    return render(request, 'home.html', context)
