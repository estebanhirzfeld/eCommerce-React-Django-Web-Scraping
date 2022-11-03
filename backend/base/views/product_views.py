from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


from base.models import Product, Review, Order, OrderItem, Size
from base.products import products
from base.serializers import ProductSerializer, SizeSerializer

from rest_framework import status


@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')

    if query == None:
        query = ''

    products = Product.objects.filter(name__icontains=query)
    
    page = request.query_params.get('page')
    paginator = Paginator(products, 12)

    try:
        products = paginator.page(page)

    except PageNotAnInteger:
        products = paginator.page(1)

    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})

    # return Response(products)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.category = data['category']


    product.description = data['description']

    # for every size in the product create or update size model
    
    # compare size in the product with size in the database if was removed delete it from the database  
    # if was added create it in the database
    # if was updated update it in the database

    for size in data['sizeToDel']:
        Size.objects.filter(id=size).delete()

    for size in data['sizes']:

        if not 'id' in size:
            size_model = Size.objects.create(
                product=product,
                size=size['size'],
                stock=size['stock']
            )
            size_model.save()
        else:
            size_model = Size.objects.get(id=size['id'])
            size_model.size = size['size']
            size_model.stock = size['stock']
            size_model.save()

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(id=pk)
    product.delete()
    return Response('Product Deleted')


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample name',
        brand='Sample brand',
        category='Sample category',
        price=0,
        description=''
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['id']
    product = Product.objects.get(id=product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image was uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createReview(request, pk):

    user = request.user
    product = Product.objects.get(id=pk)

    data = request.data

    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    else:

        # only user who has ordered the product can review it
        order = Order.objects.filter(user=user)
        orderItems = OrderItem.objects.filter(product=product)

        ordered = orderItems.filter(order__in=order).exists()

        if ordered:
            review = Review.objects.create(
                user=user,
                product=product,
                name=user.first_name,
                rating=data['rating'],
                comment=data['comment'],
            )

            reviews = product.review_set.all()
            product.numReviews = len(reviews)

            total = 0
            for i in reviews:
                total += i.rating

            product.rating = total / len(reviews)
            product.save()

            return Response('Review added')

        else:
            content = {'detail': 'You have not ordered this product'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        