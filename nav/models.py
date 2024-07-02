from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser

# Create your models here.
class MyUser(AbstractUser):
    # username pattern : name2328 (name + 4 digits)
    username = models.CharField(unique=True, max_length=64, validators=[RegexValidator(r'^[a-zA-Z]+\d{4}$')])
    name = models.CharField(max_length=64)
    password = models.CharField(max_length=64)
    role = models.CharField(choices=[('student', 'Student'), ('visitor', 'Visitor'), ('admin', 'Admin'), ('other', 'Other')], max_length=64)

    created_at = models.DateTimeField(auto_now_add=True)
    lat = models.FloatField(default=0)
    lon = models.FloatField(default=0)
    last_updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['name', 'role']

    def __str__(self):
        return self.username