from django.contrib import admin

from .models import Text, Translation

admin.site.register(Text)
admin.site.register(Translation)