# Generated by Django 4.1.1 on 2022-09-23 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0014_alter_order_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='paymentLink',
            field=models.CharField(blank=True, max_length=600, null=True),
        ),
    ]