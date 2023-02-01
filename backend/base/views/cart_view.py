from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Cart, CartItem, Product, ProductAttribute, Size, Color
from base.serializers import CartSerializer, CartItemSerializer

from rest_framework import status

from django.contrib.auth.models import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCartItems(request):
    user = request.user
    # if user has no cart, create one
    cart, created = Cart.objects.get_or_create(user=user)
    cartItems = cart.cartitem_set.all()
    serializer = CartItemSerializer(cartItems, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addToCart(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)

    size = Size.objects.get(size=request.data['size'])
    color = Color.objects.get(color=request.data['color'])

    productAttribute = ProductAttribute.objects.get(product=product, size=size, color=color)

    # if user has no cart, create one
    cart, created = Cart.objects.get_or_create(user=user)
    
    print('----------------------------\n')
    print('product: ', product)
    print('----------------------------\n')
    print('size: ', size)
    print('----------------------------\n')
    print('color: ', color)
    print('----------------------------\n')
    print('productAttribute: ', productAttribute)
    print('----------------------------\n')

    productExists = CartItem.objects.filter(cart=cart, product=product, productAttribute=productAttribute).exists()

    if productExists:
        print('----------------------------\n')
        print('product exists')
        print('----------------------------\n')
        cartItem = CartItem.objects.get(cart=cart, product=product, productAttribute=productAttribute)
        cartItem.qty = request.data['qty']
        if cartItem.qty == 0:
            cartItem.delete()
        if cartItem.qty > productAttribute.stock:
            cartItem.qty = productAttribute.stock

        cartItem.save()
    else:
        print('----------------------------\n')
        print('product does not exist')
        print('----------------------------\n')
        cartItem = CartItem.objects.create(
            cart=cart,
            product=product,
            productAttribute=productAttribute,
            qty=request.data['qty']
        )
        cartItem.save()

    cartItems = CartItem.objects.filter(cart=cart, cart__user=user)
    serializer = CartItemSerializer(cartItems, many=True)
    return Response(serializer.data)








@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def removeFromCart(request, pk):
    user = request.user
    cart = Cart.objects.get(user=user)
    cartItem = cart.cartitem_set.get(id=pk)
    cartItem.delete()
    cartItems = cart.cartitem_set.all()
    serializer = CartItemSerializer(cartItems, many=True)
    return Response(serializer.data)

# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def updateCartItems(request, pk):
#     user = request.user
#     cart = Cart.objects.get(user=user)
#     cartItem = cart.cartitem_set.get(id=pk)
#     cartItem.qty = request.data['qty']
#     cartItem.save()
#     cartItems = cart.cartitem_set.all()
#     serializer = CartItemSerializer(cartItems, many=True)
#     return Response(serializer.data)

# clearCartItems
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clearCartItems(request):
    user = request.user
    cart = Cart.objects.get(user=user)
    cart.cartitem_set.all().delete()
    
    # rerurn cartitem serializer
    cartItems = cart.cartitem_set.all()
    serializer = CartItemSerializer(cartItems, many=True)
    return Response(serializer.data)