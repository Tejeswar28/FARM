from django.contrib import admin

from .models import UserProfile
from django.contrib import admin

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'phone')
    search_fields = ('user__username', 'phone')
