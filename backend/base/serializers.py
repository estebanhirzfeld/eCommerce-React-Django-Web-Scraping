from dataclasses import fields
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Order, OrderItem, ShippingAddress
from rest_framework_simplejwt.tokens import RefreshToken


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


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    OrderItems = serializers.SerializerMethodField(read_only=True)
    ShippingAddress = serializers.SerializerMethodField(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'OrderItems',
            'ShippingAddress',
            'user',
            'paymentMethod',
            'taxPrice',
            'shippingPrice',
            'totalPrice',
            'isPaid',
            'paidAt',
            'isDelivered',
            'deliveredAt',
            'createdAt',
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
