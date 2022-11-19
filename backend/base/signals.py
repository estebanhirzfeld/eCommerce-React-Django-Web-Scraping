from django.db.models.signals import pre_save
from django.dispatch import receiver

from django.contrib.auth.models import User
from .models import Order


def updateOrder(sender, instance, **kwargs):
    order = instance
    if order.isPaid and order.isDelivered:
        order.status = 'Success'

    if order.isPaid and not order.isDelivered:
        order.status = 'Pending'

    if not order.isPaid and not order.isDelivered:
        order.status = 'Pending'

def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email

# Order
pre_save.connect(updateOrder, sender=Order)
# User
pre_save.connect(updateUser, sender=User)
