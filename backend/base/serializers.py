
from collections import OrderedDict
from dataclasses import fields
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, ProductImage, Order, OrderItem, ShippingAddress, Review, Size, Cart, CartItem, Wishlist, WishlistItem, SavedForLater, SavedForLaterItem, Color, ProductAttribute
from rest_framework_simplejwt.tokens import RefreshToken


class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()
    stock = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id', 'product','size', 'color', 'qty', 'stock']

    def get_product(self, obj):
        product = obj.product
        serializer = ProductSerializer(product, many=False)
        return serializer.data

    def get_size(self, obj):
        if obj.productAttribute is not None:
            size = obj.productAttribute.size.all()
            if size:
                return size[0].size
        return None
    
    def get_color(self, obj):
        if obj.productAttribute is not None:
            color = obj.productAttribute.color.all()
            if color:
                return color[0].color
        return None
    
    def get_stock(self, obj):
        if obj.productAttribute is not None:
            return obj.productAttribute.stock
        return None




class CartSerializer(serializers.ModelSerializer):
    cartItems = serializers.SerializerMethodField(read_only=True)

    def get_cartItems(self, obj):
        cartItems = obj.cartitem_set.all()
        serializer = CartItemSerializer(cartItems, many=True)
        return serializer.data

    class Meta:
        model = Cart
        fields = ['cartItems', 'createdAt']

# Wishlist


class WishlistItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField(read_only=True)

    def get_product(self, obj):
        product = obj.product
        serializer = ProductSerializer(product, many=False)
        return serializer.data

    class Meta:
        model = WishlistItem
        fields = ['product', 'id']


class WishlistSerializer(serializers.ModelSerializer):
    wishlistItems = serializers.SerializerMethodField(read_only=True)

    def get_wishlistItems(self, obj):
        wishlistItems = obj.wishlistitem_set.all()
        serializer = WishlistItemSerializer(wishlistItems, many=True)
        return serializer.data

    class Meta:
        model = Wishlist
        fields = ['wishlistItems', 'createdAt']

# SavedForLater


class SavedForLaterItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField(read_only=True)
    stock = serializers.SerializerMethodField(read_only=True)

    # get stock of product for that size
    def get_stock(self, obj):
        product = obj.product
        size = obj.size
        stock = product.size_set.get(size=size).stock
        return stock

    def get_product(self, obj):
        product = obj.product
        serializer = ProductSerializer(product, many=False)
        return serializer.data

    class Meta:
        model = SavedForLaterItem
        fields = ['product', 'qty', 'size', 'stock', 'id']


class SavedForLaterSerializer(serializers.ModelSerializer):
    savedForLaterItems = serializers.SerializerMethodField(read_only=True)

    def get_savedForLaterItems(self, obj):
        savedForLaterItems = obj.savedforlateritem_set.all()
        serializer = SavedForLaterItemSerializer(savedForLaterItems, many=True)
        return serializer.data

    class Meta:
        model = SavedForLater
        fields = ['savedForLaterItems', 'createdAt']


class ShippingAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShippingAddress
        fields = ['address', 'city', 'postalCode',
                  'province', 'id', 'lat', 'lon']


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    is_Admin = serializers.SerializerMethodField(read_only=True)
    addresses = serializers.SerializerMethodField(read_only=True)

    def get_addresses(self, obj):
        address = obj.shippingaddress_set.all()
        serializer = ShippingAddressSerializer(address, many=True)
        return serializer.data

    def get_cart(self, obj):
        # cart has foreign key to user, so we can get cart by user
        cart = obj.cart_set.all()
        serializer = CartSerializer(cart, many=True)
        return serializer.data

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'is_Admin', 'addresses']

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name

    def get_is_Admin(self, obj):
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'is_Admin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['size']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['color']

class ProductAttributeSerializer(serializers.ModelSerializer):
    color = serializers.StringRelatedField(many=True)
    size = serializers.StringRelatedField(many=True)

    class Meta:
        model = ProductAttribute
        fields = ['color', 'size', 'stock']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        result = {}
        for color in data['color']:
            result[color] = {
                data['size'][0]: data['stock']
            }
        return result


class ProductSerializer(serializers.ModelSerializer):
    colors = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField(read_only=True)
    images = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = ['category', 'subCategory', 'createdAt', 'description', 'id', 'name', 'numReviews', 'price', 'rating', 'colors', 'reviews', 'images', 'original_url', 'is_active']

    def get_images(self, obj):
        images = obj.productimage_set.all()
        serializer = ProductImageSerializer(images, many=True)
        return serializer.data

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def get_colors(self, instance):
        product_attributes = ProductAttribute.objects.filter(product=instance)
        serializer = ProductAttributeSerializer(product_attributes, many=True)
        return serializer.data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        result = {}
        for attribute in data['colors']:
            for color, sizes in attribute.items():
                if color not in result:
                    result[color] = {}
                result[color].update(sizes)
        data['colors'] = result
        return data


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image', 'id']

class OrderSerializer(serializers.ModelSerializer):
    OrderItems = serializers.SerializerMethodField(read_only=True)
    user = UserSerializer(read_only=True)
    shippingAddress = ShippingAddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = (
            'status',
            'user',
            'OrderItems',
            'shippingAddress',
            'paymentMethod',
            'shippingPrice',
            'totalPrice',
            'expiryDate',
            'isPaid',
            'paidAt',
            'isDelivered',
            'deliveredAt',
            'createdAt',
            'id',
            'paymentProof',
        )

    def get_OrderItems(self, obj):
        orders = obj.orderitem_set.all()
        serializer = OrderItemSerializer(orders, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        shippingAddress = obj.shippingAddress
        serializer = ShippingAddressSerializer(shippingAddress, many=False)
        return serializer.data

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
