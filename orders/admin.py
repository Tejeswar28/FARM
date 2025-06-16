from django.contrib import admin

from .models import Order
from django.contrib import admin

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('name', 'number_of_sheep', 'weight', 'cost', 'status', 'created_at')
    search_fields = ('name', 'email', 'phone')
