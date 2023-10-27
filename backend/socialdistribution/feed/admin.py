from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Friends)
admin.site.register(Notifications)
admin.site.register(FollowerRequest)