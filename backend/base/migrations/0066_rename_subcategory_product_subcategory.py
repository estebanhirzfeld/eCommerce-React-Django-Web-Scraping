# Generated by Django 4.1.1 on 2023-03-06 14:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0065_product_subcategory'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='subcategory',
            new_name='subCategory',
        ),
    ]
