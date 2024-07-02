from django.contrib import admin
from .models import MyUser as User

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'name', 'role', 'created_at', 'lat', 'lon', 'last_updated_at')

admin.site.register(User, UserAdmin)