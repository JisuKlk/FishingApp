
# Register your models here.

from django.contrib import admin
from .models import Capture

@admin.register(Capture)
class CaptureAdmin(admin.ModelAdmin):
    list_display = ('species', 'size', 'weight', 'bait', 'location', 'date')
    search_fields = ('species', 'bait', 'location')
