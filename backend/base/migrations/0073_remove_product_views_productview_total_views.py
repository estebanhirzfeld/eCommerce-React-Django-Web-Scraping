# Generated by Django 4.1.1 on 2023-04-20 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0072_alter_order_options_alter_product_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='views',
        ),
        migrations.AddField(
            model_name='productview',
            name='total_views',
            field=models.IntegerField(default=0),
        ),
    ]
