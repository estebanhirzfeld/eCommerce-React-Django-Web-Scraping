# Generated by Django 4.1.1 on 2022-12-06 13:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0055_remove_color_product_remove_size_stock_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='color',
            name='sizes',
        ),
    ]
