# Generated by Django 4.1.1 on 2022-10-14 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0022_shippingaddress_lat_shippingaddress_lon'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, default='/placeholder.png', null=True, upload_to=''),
        ),
    ]