# Generated by Django 4.1.1 on 2022-10-10 20:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0020_alter_shippingaddress_lat_alter_shippingaddress_lon'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shippingaddress',
            name='lat',
        ),
        migrations.RemoveField(
            model_name='shippingaddress',
            name='lon',
        ),
    ]
