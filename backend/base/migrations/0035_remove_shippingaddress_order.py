# Generated by Django 4.1.1 on 2022-11-06 21:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0034_cartitem_stock'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shippingaddress',
            name='order',
        ),
    ]