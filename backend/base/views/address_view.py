from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import ShippingAddress
from base.serializers import ShippingAddressSerializer

from rest_framework import status

from django.contrib.auth.models import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAddresses(request):
    # return the addresses of the logged in user from the newest to the oldest
    user = request.user
    addresses = ShippingAddress.objects.filter(user=user).order_by('-createdAt')
    serializer = ShippingAddressSerializer(addresses, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createAddress(request):
    user = request.user
    data = request.data

    # check if the user has already 5 addresses
    if ShippingAddress.objects.filter(user=user).count() == 5:
        # delete the oldest address
        oldest_address = ShippingAddress.objects.filter(user=user).order_by('createdAt')[0]
        oldest_address.delete()

    # check if the address is already in the database
    if ShippingAddress.objects.filter(user=user, address=data['address'], city=data['city'], postalCode=data['postalCode'], province=data['province']).exists():
        address = ShippingAddress.objects.get(user=user, address=data['address'], city=data['city'], postalCode=data['postalCode'], province=data['province'])
        serializer = ShippingAddressSerializer(address, data=data)

        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)

    # if the address is not in the database, create a new one
    else:
        address = ShippingAddress.objects.create(
            user=user,
            address=data['address'],
            postalCode=data['postalCode'],
            city=data['city'],
            province=data['province'],

            # if lat = -34.608354 and lon = -58.438682 set to empty string
            lat=data['lat'] if data['lat'] != -34.608354 else 0,
            lon=data['lon'] if data['lon'] != -58.438682 else 0,


            # if name is not provided, it will be set to principal address
            name=data['name'] if 'name' in data else 'Principal address',

    )

    serializer = ShippingAddressSerializer(address, many=False)
    return Response(serializer.data)