# Generated by Django 4.1.1 on 2022-11-05 05:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0030_remove_cartitem_image_remove_cartitem_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartitem',
            name='stock',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
