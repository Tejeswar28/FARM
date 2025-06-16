from django.contrib import admin
from django.utils.html import format_html
from .models import GalleryItem

@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'display_media', 'uploaded_at', 'uploaded_by')
    search_fields = ('title', 'description')
    list_filter = ('type', 'uploaded_at')
    
    def display_media(self, obj):
        if obj.type == 'image' and obj.file:
            return format_html('<img src="{}" width="100" height="75" />', obj.file.url)
        elif obj.type == 'video' and obj.video_url:
            return format_html('<a href="{}" target="_blank">View Video</a>', obj.video_url)
        return "No media"
    
    display_media.short_description = 'Media Preview'
