# Generated by Django 4.1.1 on 2023-02-01 23:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0063_remove_cartitem_color_remove_cartitem_size_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='color',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]