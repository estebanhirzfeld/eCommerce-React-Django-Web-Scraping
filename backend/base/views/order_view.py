import random
import requests

import mercadopago
from datetime import datetime
from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product, Order, OrderItem, ShippingAddress, ProductAttribute, ProductImage, Size, Color
from base.serializers import ProductSerializer, OrderSerializer, ShippingAddressSerializer

from rest_framework import status

from django.contrib.auth.models import User


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data['orderItems']
    shippingAddress = ShippingAddress.objects.get(id=data['shippingAddress'])

    if orderItems and len(orderItems) == 0:
        return Response({'message': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)

    if not shippingAddress:
        return Response({'message': 'No Shipping Address'}, status=status.HTTP_400_BAD_REQUEST)
        
    else:
        # (1) Create order
        # (2) find shipping address by id
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
            shippingAddress=shippingAddress
        )

        # (3) Create order items and set order to orderItem relationship
        for item in orderItems:
            product = Product.objects.get(id=item['product']['id'])
            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item['qty'],
                size=item['size'],
                color=item['color'],
                price=product.price,
                image=product.productimage_set.first().image.url
            )

            # (4) Update stock

            # if qty > stock, return error
            # if item.qty > product.size_set.filter(size=item.size).first().stock:
            #     return Response({'message': 'Product is out of stock'}, status=status.HTTP_400_BAD_REQUEST)
            
            # use qty from ProductAttribute model
            # if item.qty > product.productattribute_set.filter(size=item.size, color=item.color).first().stock:
            if item.qty > product.productattribute_set.filter(size=Size.objects.get(size=item.size), color=Color.objects.get(color=item.color)).first().stock:
                return Response({'message': 'Product is out of stock'}, status=status.HTTP_400_BAD_REQUEST)
            
            # if qty <= stock, update stock
            else:
            # get stock from that size
                # product.size_set.filter(size=item.size).update(stock=product.size_set.filter(size=item.size).first().stock - int(item.qty))
                # product.save()
                # product.productattribute_set.filter(size=item.size, color=item.color).update(stock=product.productattribute_set.filter(size=item.size, color=item.color).first().stock - int(item.qty))
                product.productattribute_set.filter(size=Size.objects.get(size=item.size), color=Color.objects.get(color=item.color)).update(stock=product.productattribute_set.filter(size=Size.objects.get(size=item.size), color=Color.objects.get(color=item.color)).first().stock - int(item.qty))
                product.save()
            
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    
    try:
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'message': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'message': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrdersByUser(request, pk):
    user = User.objects.get(id=pk)
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def mercadoPagoWebhook(request, pk):
    data = request.data
    order = Order.objects.get(id=pk)
    if data.get('type') == 'payment':
        payment_id = data['data']['id']
        
        url = f'https://api.mercadopago.com/v1/payments/{payment_id}'
        headers = {'Authorization': 'Bearer APP_USR-944357534465341-092314-60cc827acfdc0e3ff80e99b84db94e81-1203886094'}

        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            payment_data = response.json()
            if payment_data.get('status') == 'approved':
                # Update the order status
                order.isPaid = True
                order.paidAt = datetime.now()
                order.save()
        return Response('Payment was received')
    else:
        return Response('Payment was not received')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(id=pk)
    order.isPaid = not order.isPaid
    order.paidAt = datetime.now()
    order.save()
    return Response('Order was paid')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(id=pk)
    order.isDelivered = not order.isDelivered
    order.deliveredAt = datetime.now()
    order.save()
    return Response('Order was delivered')


@api_view(['GET'])
def test(request):

    # def generate_random_coords():
    #     lat_min, lat_max = -55.0, -20.0
    #     lon_min, lon_max = -75.0, -50.0
    #     lat = random.uniform(lat_min, lat_max)
    #     lon = random.uniform(lon_min, lon_max)
    #     return {'lat': lat, 'lon': lon}

    # # Generate 20 random coordinates
    # coords = [generate_random_coords() for i in range(60)]

    # # create a new order for every location with a random product and user id 1 (admin) and using the coords with test address
    # for coord in coords:
    #     shipping_address = ShippingAddress.objects.create(
    #         address='test',
    #         city='test',
    #         postalCode='test',
    #         province='test',
    #         lat=coord['lat'],
    #         lon=coord['lon']
    #     )
    #     order = Order.objects.create(
    #         user = User.objects.get(id=1),
    #         shippingAddress=shipping_address,
    #         paymentMethod='Mercado Pago',
    #         shippingPrice=0,
    #         totalPrice=0,
    #         isPaid=True,
    #         paidAt=datetime.now(),
    #         isDelivered=False,
    #         deliveredAt=None
    #     )
    #     # create a random product for every order
    #     product = Product.objects.get(id=random.randint(383, 400))
    #     orderItem = OrderItem.objects.create(
    #         product=product,
    #         order=order,
    #         name=product.name,
    #         qty=1,
    #         price=product.price,
    #         # image= ProductImage.objects.get(product=product).image.url
    #         # get the first image of the product
    #         image=product.productimage_set.all()[0].image.url
    #     )
    #     orderItem.save()
    #     order.save()
    return Response('Orders created')
