from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver



from django.contrib.auth.models import User

from backend.tasks import send_product_notification_email
from .models import Order, ProductAttribute, StockNotification


from django.core.serializers.json import DjangoJSONEncoder



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


def serialize_size(size):
    return size.size

def serialize_color(color):
    return color.color

@receiver(post_save, sender=ProductAttribute)
def notify_users(sender, instance, **kwargs):
    if instance.stock > 0:
        # Filtrar los usuarios y direcciones de correo electrónico que desean ser notificados para este producto
        users_to_notify = User.objects.filter(
            stocknotification__product_attribute=instance,
            stocknotification__is_notified=False
        )
        emails_to_notify = StockNotification.objects.filter(
            email__isnull=False,
            product_attribute=instance,
            is_notified=False
        )

        print('-----------------------------\n')
        print(instance.product)
        print('-----------------------------\n')

        product = instance.product
        product_id = product.id

        
        

        # Enviamos una notificación a cada usuario o dirección de correo electrónico
        for user in users_to_notify:
            size_dict = serialize_size(instance.size.first())
            color_dict = serialize_color(instance.color.first())
            send_product_notification_email.delay(
                user.email,
                instance.product.name,
                size_dict,
                color_dict,
                product_id
            )
            StockNotification.objects.update_or_create(
                user=user,
                product_attribute=instance,
                defaults={'is_notified': True}
            )

        for email in emails_to_notify:
            size_dict = serialize_size(instance.size.first())
            color_dict = serialize_color(instance.color.first())
            send_product_notification_email.delay(
                email.email,
                instance.product.name,
                size_dict,
                color_dict,
                product_id,
            )
            email.is_notified = True
            email.save()




pre_save.connect(updateOrder, sender=Order)
# User
pre_save.connect(updateUser, sender=User)
