from dataclasses import fields
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, ProductImage, Order, OrderItem, ShippingAddress, Review, Size, Cart, CartItem, Wishlist, WishlistItem, SavedForLater, SavedForLaterItem
from rest_framework_simplejwt.tokens import RefreshToken

# Cart
class CartItemSerializer(serializers.ModelSerializer):
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
        model = CartItem
        fields = ['product', 'qty', 'size', 'stock', 'id']


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
        fields = ['address', 'city', 'postalCode', 'province', 'id', 'lat', 'lon']

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
        fields = ['id', 'size', 'stock']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image', 'id']


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    sizes = serializers.SerializerMethodField(read_only=True)
    images = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = ['brand','category','createdAt', 'description', 'id', 'name', 'numReviews', 'price', 'rating', 'sizes', 'reviews', 'images']

    def get_images(self, obj):
        images = obj.productimage_set.all()
        serializer = ProductImageSerializer(images, many=True)
        return serializer.data

    def get_sizes(self, obj):
        sizes = obj.size_set.all()
        serializer = SizeSerializer(sizes, many=True)
        return serializer.data

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


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
