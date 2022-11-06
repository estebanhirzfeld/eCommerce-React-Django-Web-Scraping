from datetime import timedelta
from django.utils.timezone import now
from email.mime import image
from unicodedata import category
from django.db import models
from django.contrib.auth.models import User

from PIL import Image


# Create your models here.

class Product(models.Model):
    # if user is deleted, set to null
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, default='/placeholder.png')
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def sizes(self):
        sizes = self.size_set.all()
        # create array of sizes.size
        size_list = [size.size for size in sizes]
        # return array of sizes.size
        return size_list

    def __str__(self):
        return self.name


class Review(models.Model):
    # if user is deleted, set to null
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(max_length=200, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    # image = models.ImageField(null=True, blank=True, default='/placeholder.png')

    def __str__(self):
        return str(self.rating)


class Order(models.Model):
    # if user is deleted, set to null
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Cancelled', 'Cancelled'),
        ('Expired','Expired'),
        ('Success', 'Success')
    )

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')

    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(
        auto_now_add=False, null=True, blank=True)

# expires in 2 minutes
    def expiration():
        return now() + timedelta(minutes=2)

    expiryDate = models.DateTimeField(default=expiration, auto_now_add=False, null=True, blank=True)

    ORDER_ORIGIN_WEBSITE = models.CharField(
        max_length=200, null=True, blank=True)
    ORDER_ORIGIN_NUMBER = models.CharField(
        max_length=20, null=True, blank=True)

    def __str__(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    size = models.CharField(max_length=100, null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=500, null=True, blank=True)
    

    def payment_status(self):
        if self.order is not None:
            return self.order.status 

    def get_user_email(self):
        if self.order is not None:
            return self.order.user.email

    def is_delivered(self):
        if self.order is not None:
            if self.order.isDelivered:
                return '✅'
            else:
                return '❌'

    def is_paid(self):
        if self.order is not None:
            if self.order.isPaid:
                return '✅'
            else:
                return '❌'

    def __str__(self):
        return str(self.name)


class ShippingAddress(models.Model):
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    postalCode = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    lon = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)


    def get_user_email(self):
        if self.order is not None:
            return self.order.user.email

    def __str__(self):
        return str(self.address)

class Size(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=100, null=True, blank=True)
    stock = models.IntegerField(null=True, blank=True, default=0)

    def __str__(self):
        return str(self.size)

# # Cart & CartItem models

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.IntegerField(null=True, blank=True, default=0)
    size = models.CharField(max_length=100, null=True, blank=True)
    stock = models.IntegerField(null=True, blank=True, default=0)

    def __str__(self):
        return str(self.product)