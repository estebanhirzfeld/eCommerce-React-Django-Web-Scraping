# Generated by Django 4.1.1 on 2022-09-18 21:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_rename__order_number_order__external_order_number_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='_External_order_number',
            new_name='ORDER_ORIGIN_NUMBER',
        ),
        migrations.RenameField(
            model_name='order',
            old_name='_External_order_origin_website',
            new_name='ORDER_ORIGIN_WEBSITE',
        ),
    ]
