from django.db import models
from django.contrib.auth.models import User
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
import os
import re

class GalleryItem(models.Model):
    IMAGE = 'image'
    VIDEO = 'video'
    TYPE_CHOICES = [
        (IMAGE, 'Image'),
        (VIDEO, 'Video'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.ImageField(upload_to='gallery/images/', blank=True, null=True)
    # Add thumbnail for optimized grid view
    thumbnail = models.ImageField(upload_to='gallery/thumbnails/', blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    # Store original dimensions for better display
    original_width = models.IntegerField(blank=True, null=True)
    original_height = models.IntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Process YouTube URL if provided
        if self.type == self.VIDEO and self.video_url:
            # Convert watch URLs to embed URLs for YouTube
            youtube_pattern = r'(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})'
            match = re.search(youtube_pattern, self.video_url)
            if match:
                video_id = match.group(1)
                self.video_url = f'https://www.youtube.com/embed/{video_id}'
        
        # First save the model to generate an ID if it's a new instance
        super().save(*args, **kwargs)
        
        # Process the image if this is an image item and we have a file
        if self.type == self.IMAGE and self.file:
            try:
                # Open the image
                img = Image.open(self.file.path)
                
                # Store original dimensions
                self.original_width = img.width
                self.original_height = img.height
                
                # Create thumbnail for grid view if it doesn't exist
                if not self.thumbnail:
                    # Create a copy of the image for the thumbnail
                    thumb_img = img.copy()
                    
                    # Create a thumbnail that maintains aspect ratio
                    thumb_img.thumbnail((400, 400), Image.LANCZOS)
                    
                    # Create output buffer
                    output_thumb = BytesIO()
                    
                    # Save the thumbnail to the buffer
                    if thumb_img.mode != 'RGB':
                        thumb_img = thumb_img.convert('RGB')
                    thumb_img.save(output_thumb, format='JPEG', quality=90)
                    output_thumb.seek(0)
                    
                    # Generate a thumbnail filename based on original
                    thumb_filename = os.path.splitext(os.path.basename(self.file.name))[0] + "_thumb.jpg"
                    
                    # Save the thumbnail
                    self.thumbnail = InMemoryUploadedFile(
                        output_thumb, 'ImageField', 
                        thumb_filename, 'image/jpeg',
                        sys.getsizeof(output_thumb), None
                    )
                  # Save the model again with the updated fields
                super().save(update_fields=['original_width', 'original_height', 'thumbnail'])
            except Exception as e:
                # Log the error but don't prevent saving
                print(f"Error processing image: {e}")
    
    @staticmethod
    def extract_youtube_id(url):
        """Extract YouTube video ID from various YouTube URL formats"""
        if not url:
            return None
            
        try:
            youtube_pattern = r'(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})'
            match = re.search(youtube_pattern, url)
            if match and match.group(1):
                return match.group(1)
                
            # Handle YouTube Shorts URLs
            shorts_pattern = r'(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})'
            shorts_match = re.search(shorts_pattern, url)
            if shorts_match and shorts_match.group(1):
                return shorts_match.group(1)
                
            return None
        except Exception as e:
            print(f"Error extracting YouTube ID: {e}")
            return None
    
    @staticmethod
    def get_youtube_embed_url(url):
        """Convert any YouTube URL to an embed URL"""
        try:
            video_id = GalleryItem.extract_youtube_id(url)
            if video_id:
                return f'https://www.youtube.com/embed/{video_id}'
            return url
        except Exception as e:
            print(f"Error creating YouTube embed URL: {e}")
            return url
    
    def __str__(self):
        return self.title

class SuggestedVideo(models.Model):
    """Model to store video suggestions from visitors"""
    url = models.URLField()
    video_id = models.CharField(max_length=20)
    title = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    
    def __str__(self):
        return f"{self.video_id} - {self.status}"
