# Generated by Django 5.0.1 on 2024-03-17 20:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_item_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='inventory',
            name='quantity',
        ),
        migrations.AddField(
            model_name='inventory',
            name='position',
            field=models.JSONField(default=dict),
        ),
    ]
