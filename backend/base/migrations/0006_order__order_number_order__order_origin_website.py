# Generated by Django 4.1.1 on 2022-09-18 21:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_product_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='_order_number',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='_order_origin_website',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
