# Generated by Django 5.0.1 on 2024-03-21 08:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0006_item_tiles_alter_inventory_position'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='type',
            field=models.CharField(default='NONE', max_length=5),
        ),
        migrations.AlterField(
            model_name='item',
            name='tiles',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='currency',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=9),
        ),
    ]
