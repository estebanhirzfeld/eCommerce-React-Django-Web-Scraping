# Generated by Django 4.1.1 on 2022-12-06 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0058_remove_size_stock'),
    ]

    operations = [
        migrations.AddField(
            model_name='productattribute',
            name='stock',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
