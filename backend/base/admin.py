from django.contrib import admin
from .models import Product, Review, Order, OrderItem, ShippingAddress, Size, Cart, CartItem
# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price',
    'sizes',
    'category', 'brand',
    'rating', 'numReviews')

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'rating', 'product', 'user')

class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'paymentMethod', 'taxPrice', 'shippingPrice', 'totalPrice', 'status', 'isPaid' ,'paidAt', 'isDelivered', 'deliveredAt', 'createdAt', 'expiryDate')

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'get_user_email', 'product', 'qty','size' ,'price', 'image', 'payment_status', 'is_paid' ,'is_delivered')

class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('order', 'get_user_email', 'address', 'city', 'postalCode', 'country', 'shippingPrice')

class SizeAdmin(admin.ModelAdmin):
    list_display = ('product','size','stock')


class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'createdAt')

class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'qty', 'size')

admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem, CartItemAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShippingAddress, ShippingAddressAdmin)
admin.site.register(Size, SizeAdmin)


