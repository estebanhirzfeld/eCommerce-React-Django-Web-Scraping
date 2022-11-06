from dataclasses import fields
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Order, OrderItem, ShippingAddress, Review, Size, Cart, CartItem
from rest_framework_simplejwt.tokens import RefreshToken


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
        fields = ['product', 'qty', 'size', 'stock']


class CartSerializer(serializers.ModelSerializer):
    cartItems = serializers.SerializerMethodField(read_only=True)

    def get_cartItems(self, obj):
        cartItems = obj.cartitem_set.all()
        serializer = CartItemSerializer(cartItems, many=True)
        return serializer.data

    class Meta:
        model = Cart
        fields = ['cartItems', 'createdAt']


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    is_Admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'is_Admin']

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


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    sizes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

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
    ShippingAddress = serializers.SerializerMethodField(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = (
            'status',
            'user',
            'OrderItems',
            'ShippingAddress',
            'paymentMethod',
            'taxPrice',
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

    def get_ShippingAddress(self, obj):
        try:
            address = ShippingAddress.objects.get(order=obj)
            serializer = ShippingAddressSerializer(address, many=False)
            return serializer.data
        except:
            return False

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'
