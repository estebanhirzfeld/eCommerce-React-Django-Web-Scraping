# Generated by Django 4.1.1 on 2023-04-20 18:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('base', '0073_remove_product_views_productview_total_views'),
    ]

    operations = [
        migrations.CreateModel(
            name='StockNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_notified', models.BooleanField(default=False)),
                ('product_attribute', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.productattribute')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'product_attribute')},
            },
        ),
    ]
