from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Wishlist, WishlistItem, SavedForLater, SavedForLaterItem, Product
from base.serializers import WishlistSerializer, WishlistItemSerializer, SavedForLaterSerializer, SavedForLaterItemSerializer

from rest_framework import status

from django.contrib.auth.models import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getWishListItems(request):
    user = request.user
    # if user has no wishlist, create one
    wishlist, created = Wishlist.objects.get_or_create(user=user)
    wishlistItems = wishlist.wishlistitem_set.all()
    serializer = WishlistItemSerializer(wishlistItems, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addToWishList(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)

    # if user has no wishlist, create one
    wishlist, created = Wishlist.objects.get_or_create(user=user)

    productExists = wishlist.wishlistitem_set.filter(product=product).exists()

    if productExists:
        wishlistItem = wishlist.wishlistitem_set.get(product=product)
        wishlistItem.save()
    else:
        wishlistItem = WishlistItem.objects.create(
            product=product,
            wishlist=wishlist,
        )
        wishlistItem.save()

    wishlistItems = wishlist.wishlistitem_set.all()
    serializer = WishlistItemSerializer(wishlistItems, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def removeFromWishList(request, pk):
    user = request.user
    wishlist = Wishlist.objects.get(user=user)
    product = Product.objects.get(id=pk)
    wishlistItem = wishlist.wishlistitem_set.get(product=product)
    wishlistItem.delete()

    wishlistItems = wishlist.wishlistitem_set.all()
    serializer = WishlistItemSerializer(wishlistItems, many=True)
    return Response(serializer.data)

# SavedForLater

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSavedForLaterItems(request):
    user = request.user
    # if user has no savedforlater, create one
    savedforlater, created = SavedForLater.objects.get_or_create(user=user)
    savedforlaterItems = savedforlater.savedforlateritem_set.all()

    serializer = SavedForLaterItemSerializer(savedforlaterItems, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addToSavedForLater(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)

    # if user has no savedforlater, create one
    savedforlater, created = SavedForLater.objects.get_or_create(user=user)

    productExists = savedforlater.savedforlateritem_set.filter(product=product, size=request.data['size']).exists()

    if productExists:
        savedforlaterItem = savedforlater.savedforlateritem_set.get(product=product, size=request.data['size'])
        savedforlaterItem.qty = request.data['qty']
        savedforlaterItem.save()
    else:
        savedforlaterItem = SavedForLaterItem.objects.create(
            product=product,
            savedforlater=savedforlater,
            size=request.data['size'],
            qty=request.data['qty'],
        )
        savedforlaterItem.save()

    savedforlaterItems = savedforlater.savedforlateritem_set.all()
    serializer = SavedForLaterItemSerializer(savedforlaterItems, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def removeFromSavedForLater(request, pk):
    user = request.user
    savedforlater = SavedForLater.objects.get(user=user)
    product = Product.objects.get(id=pk)
    savedforlaterItem = savedforlater.savedforlateritem_set.get(product=product)
    savedforlaterItem.delete()

    savedforlaterItems = savedforlater.savedforlateritem_set.all()
    serializer = SavedForLaterItemSerializer(savedforlaterItems, many=True)
    return Response(serializer.data)

