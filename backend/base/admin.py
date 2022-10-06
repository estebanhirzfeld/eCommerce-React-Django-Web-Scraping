from django.contrib import admin
from .models import Product, Review, Order, OrderItem, ShippingAddress
# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'brand', 'countInStock', 'rating', 'numReviews')

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'rating', 'product', 'user')

class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'paymentMethod', 'taxPrice', 'shippingPrice', 'totalPrice', 'isPaid', 'paidAt', 'isDelivered', 'deliveredAt', 'createdAt', 'expiryDate')

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'get_user_email', 'product', 'name', 'qty', 'price', 'image', 'is_paided', 'is_delivered')

class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('order', 'get_user_email', 'address', 'city', 'postalCode', 'country', 'shippingPrice')

admin.site.register(Product, ProductAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShippingAddress, ShippingAddressAdmin)


