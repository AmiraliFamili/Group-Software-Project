# Generated by Django 5.0.1 on 2024-03-15 13:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_location_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='image',
            field=models.ImageField(null=True, upload_to='images/'),
        ),
    ]