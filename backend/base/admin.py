from django.contrib import admin
from .models import Product, ProductImage, Review, Order, OrderItem, ShippingAddress, Size, Cart, CartItem, Wishlist, WishlistItem, SavedForLater, SavedForLaterItem, Color, ProductAttribute
# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price',
    # 'sizes',
    # 'colors',
    'category', 'brand',
    # 'rating', 'numReviews',
    # 'is_scraped'
    )

class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image')

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'rating', 'product', 'user')

class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'paymentMethod',
    'shippingAddress',
    'shippingPrice', 'totalPrice', 'status', 'isPaid' ,'paidAt', 'isDelivered', 'deliveredAt', 'createdAt', 'expiryDate')

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'get_user_email', 'product', 'qty','size' ,'price', 'image', 'payment_status', 'is_paid' ,'is_delivered')

class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = (
    # 'order',
    # 'get_user_email', 
    # 'shippingPrice'
    'name',
    'user',
    'address', 'city', 'postalCode',
    'province'
    )

class SizeAdmin(admin.ModelAdmin):
    list_display = (
        # 'product',
        'size',
        'id',
        # 'stock'
        )

class ColorAdmin(admin.ModelAdmin):
    list_display = (
        # 'product',
        'color',
        # 'sizes',
        # 'stock'
        )

class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = (
        'product',
        'colors',
        'sizes',
        'stock'
        )

class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'createdAt')

class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'qty', 'size')

class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'createdAt')

class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('wishlist', 'product')

class SavedForLaterAdmin(admin.ModelAdmin):
    list_display = ('user', 'createdAt')

class SavedForLaterItemAdmin(admin.ModelAdmin):
    list_display = ('savedForLater', 'product')

admin.site.register(Wishlist, WishlistAdmin)
admin.site.register(WishlistItem, WishlistItemAdmin)
admin.site.register(SavedForLater, SavedForLaterAdmin)
admin.site.register(SavedForLaterItem, SavedForLaterItemAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem, CartItemAdmin)

admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage, ProductImageAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShippingAddress, ShippingAddressAdmin)
admin.site.register(Size, SizeAdmin)
admin.site.register(Color, ColorAdmin)
admin.site.register(ProductAttribute, ProductAttributeAdmin)


