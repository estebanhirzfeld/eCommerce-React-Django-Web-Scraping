# Generated by Django 4.1.1 on 2022-11-09 10:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0041_shippingaddress_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='taxPrice',
        ),
        migrations.AddField(
            model_name='order',
            name='shippingAddress',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.shippingaddress'),
        ),
    ]
