# Generated by Django 4.1.1 on 2022-10-11 21:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0021_remove_shippingaddress_lat_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='shippingaddress',
            name='lat',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='shippingaddress',
            name='lon',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
    ]
