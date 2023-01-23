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
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)

    is_scraped = models.BooleanField(default=False)

    original_url = models.URLField(max_length=200, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    # def colors(self):
    #     colors = self.color_set.all()
    #     color_list = [color.color for color in colors]
    #     return color_list

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField(null=True, blank=True)

    original_url = models.URLField(max_length=300, null=True, blank=True)

    def __str__(self):
        return self.product.name


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
    shippingAddress = models.ForeignKey('shippingAddress', on_delete=models.SET_NULL, null=True)
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

# expires in 1 day
    def expiration():
        return now() + timedelta(days=1)

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
    name = models.CharField(max_length=200, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    address = models.CharField(max_length=100, null=True, blank=True)
    postalCode = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)

    PROVINCE_CHOICES = (
        ("Capital Federal", "Capital Federal"), 
        ("Gran Buenos Aires", "Gran Buenos Aires"), 
        ("Buenos Aires", "Buenos Aires"), 
        ("Catamarca", "Catamarca"), 
        ("Chaco", "Chaco"), 
        ("Chubut", "Chubut"), 
        ("Córdoba", "Córdoba"), 
        ("Corrientes", "Corrientes"), 
        ("Entre Ríos", "Entre Ríos"), 
        ("Formosa", "Formosa"), 
        ("Jujuy", "Jujuy"), 
        ("La Pampa", "La Pampa"), 
        ("La Rioja", "La Rioja"), 
        ("Mendoza", "Mendoza"), 
        ("Misiones", "Misiones"), 
        ("Neuquén", "Neuquén"), 
        ("Río Negro", "Río Negro"), 
        ("Salta", "Salta"), 
        ("San Juan", "San Juan"), 
        ("San Luis", "San Luis"), 
        ("Santa Cruz", "Santa Cruz"), 
        ("Santa Fe", "Santa Fe"), 
        ("Santiago del Estero", "Santiago del Estero"), 
        ("Tierra del Fuego", "Tierra del Fuego"), 
        ("Tucumán", "Tucumán")
    )

    province = models.CharField(max_length=100, choices=PROVINCE_CHOICES, null=True, blank=True)

    lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    lon = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Shipping Addresses'

    def __str__(self):
        return str(self.address)
        

class Size(models.Model):
    size = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return str(self.size)

class Color(models.Model):
    color = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return str(self.color)

class ProductAttribute (models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    color = models.ManyToManyField(Color, blank=True)
    size = models.ManyToManyField(Size, blank=True)
    stock = models.IntegerField(null=True, blank=True, default=0)

    def colors(self):
        return "\n".join([p.color for p in self.color.all()])

    def sizes(self):
        return "\n".join([p.size for p in self.size.all()])

    def __str__(self):
        return str(self.product)


# # Cart & CartItem models
class Cart(models.Model):
    # one cart per user
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.IntegerField(null=True, blank=True, default=0)
    productAttribute = models.ForeignKey(ProductAttribute, on_delete=models.CASCADE, null=True, blank=True)

    def get_size(self):
        if self.productAttribute is not None:
            size = self.productAttribute.size.all()
            if size:
                return size[0].size
        return None
        
    def get_color(self):
        if self.productAttribute is not None:
            color = self.productAttribute.color.all()
            if color:
                return color[0].color
        return None

    def __str__(self):
        return str(self.product)

# # Wishlist & WishlistItem models
class Wishlist(models.Model):
    # one wishlist per user
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user)

class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.product)

# SavedForLater & SavedForLaterItem models

class SavedForLater(models.Model):
    # one saved for later list per user
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user)

class SavedForLaterItem(models.Model):
    savedForLater = models.ForeignKey(SavedForLater, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.product)