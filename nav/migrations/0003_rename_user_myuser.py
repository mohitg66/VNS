# Generated by Django 5.0.3 on 2024-07-01 15:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('admin', '0003_logentry_add_action_flag_choices'),
        ('auth', '0012_alter_user_first_name_max_length'),
        ('nav', '0002_rename_myuser_user'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='User',
            new_name='MyUser',
        ),
    ]
