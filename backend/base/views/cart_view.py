from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Cart, CartItem, Product
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

    # if user has no cart, create one
    cart, created = Cart.objects.get_or_create(user=user)

    productExists = cart.cartitem_set.filter(product=product, size=request.data['size']).exists()

    if productExists:
        cartItem = cart.cartitem_set.get(product=product , size=request.data['size'])
        cartItem.qty = request.data['qty']
        cartItem.save()
    else:
        cartItem = CartItem.objects.create(
            product=product,
            cart=cart,
            qty=request.data['qty'],
            size=request.data['size']
        )
        cartItem.save()

    cartItems = cart.cartitem_set.all()
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