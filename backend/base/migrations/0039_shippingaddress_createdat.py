# Generated by Django 4.1.1 on 2022-11-07 00:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0038_alter_shippingaddress_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='shippingaddress',
            name='createdAt',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]