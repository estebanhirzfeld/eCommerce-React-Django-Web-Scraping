# Generated by Django 4.1.1 on 2022-10-24 20:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0025_alter_order_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='comment',
            field=models.TextField(blank=True, max_length=200, null=True),
        ),
    ]
