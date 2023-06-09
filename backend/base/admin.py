from django.db.models import Sum
from django.contrib import admin
from .models import Product, ProductImage, Review, Order, OrderItem, ShippingAddress, Size, Cart, CartItem, Wishlist, WishlistItem, SavedForLater, SavedForLaterItem, Color, ProductAttribute, StockNotification, Ticker
from urllib.parse import urlparse
# Register your models here.


class DomainFilter(admin.SimpleListFilter):
    title = 'Domain'
    parameter_name = 'domain'

    def lookups(self, request, model_admin):
        queryset = model_admin.get_queryset(request)
        domains = set(urlparse(p.original_url).hostname.split(
            '.')[1] for p in queryset if p.original_url)
        return [(d, d) for d in domains]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(original_url__icontains=f'.{self.value()}.')


class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price',
                    # 'sizes',
                    # 'colors',
                    'category',
                    'last_day',
                    'last_week',
                    # 'total_views',
                    # 'last_month_views',
                    # 'brand',
                    # 'rating', 'numReviews',
                    'is_scraped',
                    'is_active',
                    'createdAt',
                    'updatedAt',
                    )
    list_filter = ('is_active', 'category', DomainFilter, 'createdAt', 'updatedAt',)
    search_fields = ('name', 'price', 'category', 'is_scraped', 'is_active')

    def total_views(self, obj):
        return obj.productview_set.aggregate(Sum('total_views'))['total_views__sum']
    total_views.admin_order_field = 'total_views'

class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image')

    search_fields = ['product__name']


class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'rating', 'product', 'user')


class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'token',
        'user', 'id', 'paymentMethod',
        'shippingAddress',
        'shippingPrice', 'totalPrice', 'status', 'isPaid', 'paidAt', 'isDelivered', 'deliveredAt', 'createdAt', 'expiryDate')


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'get_user_email', 'product', 'qty', 'size',
                    'price', 'image', 'payment_status', 'is_paid', 'is_delivered')


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
        'stock',
        'id'
    )
    search_fields = ['product__name', 'id']


class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'createdAt')


class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart',
                    'product',
                    'qty',
                    'get_size',
                    'get_color',
                    'createdAt',
                    # 'size',
                    # 'color',
                    # 'stock'
                    )


class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'createdAt')


class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('wishlist', 'product', 'addedAt')


class SavedForLaterAdmin(admin.ModelAdmin):
    list_display = ('user', 'createdAt')


class SavedForLaterItemAdmin(admin.ModelAdmin):
    list_display = ('savedForLater', 'product')

class StockNotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'email', 'product_attribute', 'get_id','is_notified')
    raw_id_fields = ('product_attribute',)

    search_fields = ['user__email', 'product_attribute__product__name', 'product_attribute__id']

class TickerAdmin(admin.ModelAdmin):
    list_display = ('message', 'createdAt')


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
admin.site.register(StockNotification, StockNotificationAdmin)

admin.site.register(Ticker, TickerAdmin)