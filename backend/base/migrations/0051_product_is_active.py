# Generated by Django 4.1.1 on 2022-11-24 23:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0050_productimage_original_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
