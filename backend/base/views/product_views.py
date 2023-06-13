# from openpyxl import Workbook

# import csv
# from django.utils.encoding import smart_str # Use smart_str to encode text as UTF-8

#

from django.db.models import Q, Min, Max, Sum, Count
from django.db.models.functions import Lower
from django.db.models import QuerySet
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
import secrets

from django.http import HttpResponse
from backend.tasks import scrape_product, scrape_discover, update_all_products


from django.utils import timezone
from datetime import timedelta

from urllib.parse import urlparse

import locale
# from base.scrape import getProductsLinks
from decimal import Decimal
from django.core.files.base import ContentFile
from PIL import Image
import requests
import time
import json
import random
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options

from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.contrib.auth.models import User


from base.models import Product, ProductImage, Review, Order, OrderItem, Size, Color, ProductAttribute, ProductView, Order, StockNotification
from base.serializers import ProductSerializer, ProductImageSerializer, SizeSerializer

from rest_framework import status


@api_view(['GET'])
def getProducts(request):

    # disable all products that contains jimmy in their original_url
    # all_products = Product.objects.filter(is_active=True)

    # for p in all_products:
    #     if 'jimmy' in p.original_url:
    #         p.is_active = False
    #         p.save()

    # Comibine Hoodies/buzos/sweaters category with Hoodies/Buzos/Sweaters

    # all_products = Product.objects.filter(is_active=True)

    # for p in all_products:
    #     if p.category == 'Hoodies/buzos/sweaters':
    #         p.category = 'Hoodies/Buzos/Sweaters'
    #         p.save()

    # Comibine Shorts y bermudas with Shorts y Bermudas

    # all_products = Product.objects.filter(is_active=True)

    # for p in all_products:
    #     if p.category == 'Shorts y bermudas':
    #         p.category = 'Shorts y Bermudas'
    #         p.save()

    # #  Massive re asign categories
    #     def map_category(category, name):
    #         # if name.upper() in ['FALDAS', 'FALDA'] or category.upper() in ['FALDAS', 'FALDA']:
    #         if any(word.upper() in name.upper() for word in ['FALDAS', 'FALDA']) or any(word.upper() in category.upper() for word in ['FALDAS', 'FALDA']):
    #             return 'Faldas'
    #         # if name.upper() in ['VESTIDOS', 'VESTIDO'] or category.upper() in ['VESTIDOS', 'VESTIDO']:
    #         if any(word.upper() in name.upper() for word in ['VESTIDOS', 'VESTIDO']) or any(word.upper() in category.upper() for word in ['VESTIDOS', 'VESTIDO']):
    #             return 'Vestidos'
    #         # if name.upper() in ['CAMISAS', 'CAMISA'] or category.upper() in ['CAMISAS', 'CAMISA']:
    #         if any(word.upper() in name.upper() for word in ['CAMISAS', 'CAMISA']) or any(word.upper() in category.upper() for word in ['CAMISAS', 'CAMISA']):
    #             return 'Camisas'
    #         # if name.upper() in ['SHORTS', 'SHORTS Y BERMUDAS', 'SHORT', 'BERMUDA', 'BERMUDAS'] or category.upper() in ['SHORTS', 'SHORTS Y BERMUDAS', 'SHORT', 'BERMUDA', 'BERMUDAS']:
    #         if any(word.upper() in name.upper() for word in ['SHORTS', 'SHORTS Y BERMUDAS', 'SHORT', 'BERMUDA', 'BERMUDAS']) or any(word.upper() in category.upper() for word in ['SHORTS', 'SHORTS Y BERMUDAS', 'SHORT', 'BERMUDA', 'BERMUDAS']):
    #             return 'Shorts y Bermudas'
    #         # if name.upper() in ['FALDAS', 'POLLERA', 'FALDA'] or category.upper() in ['FALDAS', 'POLLERA', 'FALDA']:
    #         if any(word.upper() in name.upper() for word in ['FALDAS', 'POLLERA', 'FALDA']) or any(word.upper() in category.upper() for word in ['FALDAS', 'POLLERA', 'FALDA']):
    #             return 'Faldas'
    #         # if name.upper() in ['REMERAS Y TOPS', 'REMERAS', 'TOPS', 'REMES', 'REMERONES', 'CAMISAS', 'CAMISETAS OVERSIZE', 'CAMISETAS', 'CAMISETA', 'TOP', 'REMERA', 'REMERON','OVERSIZE'] or category.upper() in ['REMERAS Y TOPS', 'REMERAS', 'TOPS', 'REMES', 'REMERONES', 'CAMISAS', 'CAMISETAS OVERSIZE', 'CAMISETAS', 'CAMISETA', 'TOP', 'REMERA', 'REMERON', 'OVERSIZE']:
    #         if any(word.upper() in name.upper() for word in ['REMERAS Y TOPS', 'REMERAS', 'TOPS', 'REMES', 'REMERONES', 'CAMISAS', 'CAMISETAS OVERSIZE', 'CAMISETAS', 'CAMISETA', 'TOP', 'REMERA', 'REMERON', 'OVERSIZE']) or any(word.upper() in category.upper() for word in ['REMERAS Y TOPS', 'REMERAS', 'TOPS', 'REMES', 'REMERONES', 'CAMISAS', 'CAMISETAS OVERSIZE', 'CAMISETAS', 'CAMISETA', 'TOP', 'REMERA', 'REMERON', 'OVERSIZE']):
    #             return 'Remeras y tops'
    #         # if name.upper() in ['BODYS', 'BODY'] or category.upper() in ['BODYS', 'BODY']:
    #         if any(word.upper() in name.upper() for word in ['BODYS', 'BODY']) or any(word.upper() in category.upper() for word in ['BODYS', 'BODY']):
    #             return 'Bodys'
    #         # if name.upper() in ['HOODIES/BUZOS', 'BUZOS Y SWEATERS', 'BUZOS', 'HOODIE/BUZOS', 'BUZO', 'SWEATERS', 'SWEATER', 'HOODIE', 'BUZOS/SWEATERS'] or category.upper() in ['HOODIES/BUZOS', 'BUZOS Y SWEATERS', 'BUZOS', 'HOODIE/BUZOS', 'BUZO', 'SWEATERS', 'SWEATER', 'HOODIE', 'BUZOS/SWEATERS']:
    #         if any(word.upper() in name.upper() for word in ['HOODIES/BUZOS', 'BUZOS Y SWEATERS', 'BUZOS', 'HOODIE/BUZOS', 'BUZO', 'SWEATERS', 'SWEATER', 'HOODIE', 'BUZOS/SWEATERS']) or any(word.upper() in category.upper() for word in ['HOODIES/BUZOS', 'BUZOS Y SWEATERS', 'BUZOS', 'HOODIE/BUZOS', 'BUZO', 'SWEATERS', 'SWEATER', 'HOODIE', 'BUZOS/SWEATERS']):
    #             return 'Hoodies/Buzos/Sweaters'
    #         # if name.upper() in ['PANTALONES', 'PANTALON', 'CALZAS', 'CALZA'] or category.upper() in ['PANTALONES', 'PANTALON', 'CALZAS', 'CALZA']:
    #         if any(word.upper() in name.upper() for word in ['PANTALONES', 'PANTALON', 'CALZAS', 'CALZA']) or any(word.upper() in category.upper() for word in ['PANTALONES', 'PANTALON', 'CALZAS', 'CALZA']):
    #             return 'Pantalones'
    #         # if name.upper() in ['CONJUNTOS', 'CONJUNTO'] or category.upper() in ['CONJUNTOS', 'CONJUNTO']:
    #         if any(word.upper() in name.upper() for word in ['CONJUNTOS', 'CONJUNTO']) or any(word.upper() in category.upper() for word in ['CONJUNTOS', 'CONJUNTO']):
    #             return 'Conjuntos'
    #         # if name.upper() in ['TRAJES DE BAÑO', 'TRAJE DE BAÑO'] or category.upper() in ['TRAJES DE BAÑO', 'TRAJE DE BAÑO']:
    #         if any(word.upper() in name.upper() for word in ['TRAJES DE BAÑO', 'TRAJE DE BAÑO']) or any(word.upper() in category.upper() for word in ['TRAJES DE BAÑO', 'TRAJE DE BAÑO']):
    #             return 'Trajes de baño'
    #         # if name.upper() in ['CHALECOS', 'CHALECO'] or category.upper() in ['CHALECOS', 'CHALECO']:
    #         if any(word.upper() in name.upper() for word in ['CHALECOS', 'CHALECO']) or any(word.upper() in category.upper() for word in ['CHALECOS', 'CHALECO']):
    #             return 'Chalecos'
    #         # if name.upper() in ['CORSET'] or category.upper() in ['CORSET']:
    #         if any(word.upper() in name.upper() for word in ['CORSET']) or any(word.upper() in category.upper() for word in ['CORSET']):
    #             return 'Corset'
    #         # if name.upper() in ['CALZADO'] or category.upper() in ['CALZADO']:
    #         if any(word.upper() in name.upper() for word in ['CALZADO']) or any(word.upper() in category.upper() for word in ['CALZADO']):
    #             return 'Calzado'
    #         # if name.upper() in ['GORRAS', 'BEANIES', 'GORRA', 'BEANIE'] or category.upper() in ['GORRAS', 'BEANIES', 'GORRA', 'BEANIE']:
    #         if any(word.upper() in name.upper() for word in ['GORRAS', 'BEANIES', 'GORRA', 'BEANIE', 'GORRO']) or any(word.upper() in category.upper() for word in ['GORRAS', 'BEANIES', 'GORRA', 'BEANIE', 'GORRO']):
    #             return 'Gorras y Beanies'
    #         # if name.upper() in ['ACCESORIOS', 'CHOKERS ECO-CUERO', 'CHOKERS CON CADENITA', 'COLLARES', 'AROS', 'ANILLOS', 'PULSERAS DE TACHAS', 'OTROS ACCESORIOS', 'PULSERAS', 'CHOKER', 'COLLAR', 'ARO', 'ANILLO', 'PULSERA'] or category.upper() in ['ACCESORIOS', 'CHOKERS ECO-CUERO', 'CHOKERS CON CADENITA', 'COLLARES', 'AROS', 'ANILLOS', 'PULSERAS DE TACHAS', 'OTROS ACCESORIOS', 'PULSERAS', 'CHOKER', 'COLLAR', 'ARO', 'ANILLO', 'PULSERA']:
    #         if any(word.upper() in name.upper() for word in ['ACCESORIOS', 'CHOKERS ECO-CUERO', 'CHOKERS CON CADENITA', 'COLLARES', 'AROS', 'ANILLOS', 'PULSERAS DE TACHAS', 'OTROS ACCESORIOS', 'PULSERAS', 'CHOKER', 'COLLAR', 'ARO', 'ANILLO', 'PULSERA']) or any(word.upper() in category.upper() for word in ['ACCESORIOS', 'CHOKERS ECO-CUERO', 'CHOKERS CON CADENITA', 'COLLARES', 'AROS', 'ANILLOS', 'PULSERAS DE TACHAS', 'OTROS ACCESORIOS', 'PULSERAS', 'CHOKER', 'COLLAR', 'ARO', 'ANILLO', 'PULSERA']):
    #             return 'Accesorios'
    #         # if name.upper() in ['MALLAS Y BERMUDAS', 'MALLAS', 'BERMUDAS', 'BERMUDA', 'MALLA'] or category.upper() in ['MALLAS Y BERMUDAS', 'MALLAS', 'BERMUDAS', 'BERMUDA', 'MALLA']:
    #         if any(word.upper() in name.upper() for word in ['MALLAS Y BERMUDAS', 'MALLAS', 'BERMUDAS', 'BERMUDA', 'MALLA']) or any(word.upper() in category.upper() for word in ['MALLAS Y BERMUDAS', 'MALLAS', 'BERMUDAS', 'BERMUDA', 'MALLA']):
    #             return 'Mallas y Bermudas'
    #         # if name.upper() in ['COLECCIÓN'] or category.upper() in ['COLECCIÓN']:
    #         if any(word.upper() in name.upper() for word in ['COLECCIÓN']) or any(word.upper() in category.upper() for word in ['COLECCIÓN']):
    #             return 'Colección'
    #         # if name.upper() in ['SALE !','OUTLET', 'SALE', 'OUTLET'] or category.upper() in ['SALE !','OUTLET', 'SALE', 'OUTLET']:
    #         if any(word.upper() in name.upper() for word in ['SALE !','OUTLET', 'SALE', 'OUTLET']) or any(word.upper() in category.upper() for word in ['SALE !','OUTLET', 'SALE', 'OUTLET']):
    #             return 'Outlet'
    #         # if name.upper() in ['THE END OF $TW'] or category.upper() in ['THE END OF $TW']:
    #         if any(word.upper() in name.upper() for word in ['THE END OF $TW']) or any(word.upper() in category.upper() for word in ['THE END OF $TW']):
    #             return 'Outlet'
    #         else:
    #             return category.title()

    #     all_products = Product.objects.filter(is_active=True)

    #     for p in all_products:
    #         print('pre category', p.category)
    #         print('pre name', p.name)
    #         post_category = map_category(p.category, p.name)
    #         print('post category', post_category)
    #         p.category = post_category
    #         p.save()

    # all_products = Product.objects.filter(is_active=True)

    # with open('all_active_products.csv', 'w', encoding='utf-8') as f:
    #     writer = csv.writer(f)
    #     writer.writerow(['id', 'name', 'price', 'original_url'])
    #     for product in all_products:
    #         writer.writerow([product.id, smart_str(product.name), product.price, product.original_url])


    # get all products with description = []
    # all_products = Product.objects.filter(is_active=True, description="[]")

    # for product in all_products:
    #     print('product', product)
    #     print('product description', product.description)

    # print('-------------------\n')
    # print('products with description = []', all_products.count())

    # print('-------------------\n')
    # print('updating products with description = []')

    # for product in all_products:
    #     scrape_product.delay(product.id)

    # print('-------------------\n')
    # print('products with description = []', all_products.count())



    # /// 2do metodo

    # wb = Workbook()
    # ws = wb.active
    # ws.append(['id', 'name', 'price', 'original url'])

    # for product in all_products:
    #     ws.append([product.id, product.name, product.price, product.original_url])

    # wb.save('all_active_products.xlsx')

    query = request.query_params.get('keyword')
    category = request.query_params.get('category')
    subcategory = request.query_params.get('subcategory')
    priceFrom = request.query_params.get('priceFrom')
    priceTo = request.query_params.get('priceTo')
    sortBy = request.query_params.get('sortBy')
    color = request.query_params.get('color')

    products = Product.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query),
        is_active=True
    )

    # get the lowest price of products in the current request
    min_price = products.aggregate(min_price=Min('price'))['min_price']
    # get the highest price of products in the current request
    max_price = products.aggregate(max_price=Max('price'))['max_price']
    # Get the categories of all active products
    categories = products.order_by().values_list('category', flat=True).distinct()
    categories = sorted(categories)

    if category:
        # products = products.filter(category=category) or product name contains the category or product category contains the category
        # products = products.filter(Q(category__icontains=category) | Q(name__icontains=category) | Q(description__icontains=category))
        products = products.filter(Q(category__icontains=category.lower()) | Q(name__icontains=category.lower()) | Q(description__icontains=category.lower())
                                   )

    if subcategory:
        products = products.filter(subCategory=subcategory)

    if priceFrom or priceTo:
        products = products.filter(price__range=(priceFrom, priceTo))

    if color:
        products = products.filter(productattribute__color__color=color)

    # Sort By
    print('---------------------------------------------------\n')
    print(sortBy)
    print('---------------------------------------------------\n')

    if sortBy == 'Lowest':
        products = products.order_by('price')
    elif sortBy == 'Highest':
        products = products.order_by('-price')
    elif sortBy == 'Popularity':
        products = products.annotate(num_views=Count(
            'productview')).order_by('-num_views')
    elif sortBy == 'Newest':
        products = products.order_by('-createdAt')
    elif sortBy == 'Rating':
        products = products.order_by('-rating')
    else:
        products = products.order_by('-createdAt')

    products = products.prefetch_related('productattribute_set__color')

    paginator = Paginator(products, 32)

    page = request.query_params.get('page', None)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page is None:
        page = 1

    page = int(page)

    serializer = ProductSerializer(products, many=True)

    colors = set()

    for product in products:
        for attribute in product.productattribute_set.all():
            colors.update(attribute.color.values_list('color', flat=True))

    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages, 'colors_list': list(colors), 'min_price': min_price, 'max_price': max_price, 'categories': categories})


@api_view(['GET'])
def getRecomendedProducts(request, pk):
    product = Product.objects.get(id=pk)
    if product:
        try:
            products = Product.objects.filter(Q(category__icontains=product.category) | Q(
                name__icontains=product.name) | Q(description__icontains=product.name), is_active=True).exclude(id=pk)[:8]

            if len(products) < 8:
                try:
                    products = products | Product.objects.filter(
                        is_active=True).exclude(id=pk)[:8-len(products)]
                except:
                    pass

            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        except:
            try:
                products = Product.objects.filter(
                    category=product.category, is_active=True).exclude(id=pk)[:8]

                if len(products) < 8:
                    try:
                        products = products | Product.objects.filter(
                            is_active=True).exclude(id=pk)[:8-len(products)]
                    except:
                        pass

                serializer = ProductSerializer(products, many=True)
                return Response(serializer.data)
            except:
                return Response({'detail': 'No products found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(id=pk)
    user = request.user
    # Registrar la nueva visita
    # ProductView.objects.create(product=product)

    # # Incrementar el contador de vistas del producto
    # product.views += 1
    # product.last_viewed_at = timezone.now()
    # product.save()

    # if user and user.is_staff:
    #     print('------------------------------------------------------ \n')
    #     print('User is Admin')
    #     print('------------------------------------------------------ \n')

    #     serializer = ProductSerializer(product, many=False)
    #     colors_list = set()
    #     sizes_list = set()
    #     categories_list = set()

    #     for attribute in product.productattribute_set.all():
    #         colors_list.update(attribute.color.values_list('color', flat=True))
    #         sizes_list.update(attribute.size.values_list('size', flat=True))

    #     for category in Product.objects.all().values_list('category', flat=True).distinct():
    #         categories_list.add(category)

        # return Response({'product': serializer.data, 'colors_list': list(colors_list), 'sizes_list': list(sizes_list), 'categories_list': list(categories_list)}, status=status.HTTP_200_OK)
    
    # else:

    if product.is_active:
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    else:
        return Response({'detail': 'Product is not available'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getProductsByCategory(request, category):
    products = Product.objects.filter(category=category, is_active=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)


    # dispatch(updateProduct({
    #     name,
    #     price,
    #     category,
    #     description,
    #     color_sizes,
    # }))

    product.name = data['name']
    product.price = data['price']
    product.category = data['category']
    product.description = data['description']

    color_sizes = data['color_sizes']
    sizes_to_delete = data['sizes_to_delete']

    product.save()


    print('------------------------------------------------------ \n')
    print(data)
    print('------------------------------------------------------ \n')

    # try to get productAtribute with the product, color and size and update it, if not exit create it
    # 'color_sizes': [
    # {'color': 'Negro', 'size': 'M', 'stock': 1, 'id': 'MNegro'},
    # {'color': 'Negro', 'size': 'S', 'stock': 1, 'id': 'SNegro'}
    # ]
    # 
    
    if color_sizes:
        for data in color_sizes:
            try:
                color_obj = Color.objects.get(color=data['color'])
            except:
                color_obj = Color(
                    color=data['color']
                )
                color_obj.save()

            
            try:
                size_obj = Size.objects.get(size=data['size'])
            except:
                size_obj = Size(
                    size=data['size']
                )
                size_obj.save()


            # if product_attribute doesn't exist, create it
            try:
                product_attribute = ProductAttribute.objects.get(
                    product=product, color=color_obj, size=size_obj)
                product_attribute.stock = data['stock']
                product_attribute.save()
                continue
            except:
                product_attribute = ProductAttribute(
                    product=product,
                    stock=data['stock']
                )

                product_attribute.save()
                product_attribute.color.add(color_obj)
                product_attribute.size.add(size_obj)

            print('Product Saved')




                # productAtt.save()
            # except:
            #     return Response({'erro: An Erro ocurred'}, status=status.HTTP_400_BAD_REQUEST)
            
    
    if sizes_to_delete:
        for data in sizes_to_delete:
            color = Color.objects.get_or_create(color=data['color'])[0]
            size = Size.objects.get_or_create(size=data['size'])[0]

            try:
                product_attribute = ProductAttribute.objects.get(
                    product=product, color=color, size=size)
                product_attribute.delete()
                print('ProductAttribute deleted')
            except ProductAttribute.DoesNotExist:
                print('ProductAttribute does not exist')

    

    # for every size in the product create or update size model

    # compare size in the product with size in the database if was removed delete it from the database
    # if was added create it in the database
    # if was updated update it in the database

    # for size in data['sizeToDel']:
    #     Size.objects.filter(id=size).delete()

    # for size in data['sizes']:
    #     if not 'id' in size:
    #         size_model = Size.objects.create(
    #             product=product,
    #             size=size['size'],
    #             stock=size['stock']
    #         )
    #         size_model.save()
    #     else:
    #         size_model = Size.objects.get(id=size['id'])
    #         size_model.size = size['size']
    #         size_model.stock = size['stock']
    #         size_model.save()

    # Now sizes and colors are managed by ProductAttribute


    # product.save()

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
        category='Sample category',
        price=0,
        description=''
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def uploadImages(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(id=product_id)
    images = request.FILES.getlist('images')

    for image in images:
        product_image = ProductImage.objects.create(
            product=product,
            image=image
        )
        product_image.save()

    # return productImage serializer
    return Response('Images were uploaded')


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteImage(request, pk):
    product_image = ProductImage.objects.get(id=pk)
    product_image.delete()
    return Response('Image was deleted')


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
        order = Order.objects.filter(user=user, status='Success')
        orderItems = OrderItem.objects.filter(order__in=order, product=product)

        if orderItems.exists():

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

# Subscribe to stock Changes


@api_view(['POST'])
def notifyProduct(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)

    data = request.data
    email = data['email']
    color = Color.objects.get(color=data['color'])
    size = Size.objects.get(size=data['size'])

    productAtt = ProductAttribute.objects.get(
        color=color, size=size, product=product)

    if email != '':
        validator = EmailValidator()
        try:
            validator(email)
        except ValidationError as error:
            return Response({'detail': str(error), 'message': 'Invalid Email'}, status=status.HTTP_400_BAD_REQUEST)

        notification = StockNotification.objects.create(
            email=email,
            product_attribute=productAtt
        )
        notification.save()
        return Response('Subscription Added')

    if request.user.is_authenticated:
        try:
            notification = StockNotification.objects.create(
                user=request.user,
                product_attribute=productAtt
            )
            notification.save()
            return Response('Subscription Added')
        except:
            print('---------------------\n')
            print('You are already subscribed?')
            print('---------------------\n')

            # return Response('You are already subscribed', status=status.HTTP_400_BAD_REQUEST)
            return Response({'detail': 'You are already subscribed'}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
def scrapeProduct(request, pk):
    # def scrapeProduct(request):
    product = Product.objects.get(id=pk)
    print('Scraping Product: ', product.name)
    # start scraping with celery
    scrape_product.delay(product.id)
    # update_all_products.delay()

    return Response('Product is being scraped')


@api_view(['GET'])
def discoverProducts(request):
    print('Discovering Products')
    # start scraping with celery
    scrape_discover.delay()
    return Response('Discover Products are being scraped')


@api_view(['GET'])
def updateProducts(request):
    print('Updating Products')
    # start scraping with celery
    update_all_products.delay()
    return Response('Products are being updated')
# @api_view(['GET'])
# def scrapeProducts(request):

#     def map_category(category):
#         if category in ['VESTIDOS']:
#             return 'Vestidos'
#         elif category in ['SHORTS', 'SHORTS Y BERMUDAS', 'Short']:
#             return 'Shorts y bermudas'
#         elif category in ['FALDAS', 'Pollera']:
#             return 'Faldas'
#         elif category in ['REMERAS Y TOPS', 'REMERAS', 'Tops', 'Remes', 'Remerones', 'CAMISAS', 'CAMISETAS OVERSIZE']:
#             return 'Remeras y tops'
#         elif category in ['BODYS', 'Body']:
#             return 'Bodys'
#         elif category in ['HOODIES/BUZOS', 'BUZOS Y SWEATERS', 'BUZOS', 'Hoodie/Buzos']:
#             return 'Hoodies/Buzos/Sweaters'
#         elif category in ['PANTALONES', 'Pantalones', 'CALZAS']:
#             return 'Pantalones'
#         elif category in ['CONJUNTOS']:
#             return 'Conjuntos'
#         elif category in ['Trajes de Baño']:
#             return 'Trajes de baño'
#         elif category in ['Chalecos']:
#             return 'Chalecos'
#         elif category in ['Corset']:
#             return 'Corset'
#         elif category in ['CALZADO']:
#             return 'Calzado'
#         elif category in ['Accesorios', 'CHOKERS eco-cuero', 'CHOKERS con cadenita', 'COLLARES', 'AROS', 'ANILLOS', 'PULSERAS DE TACHAS', 'OTROS ACCESORIOS', 'PULSERAS']:
#             return 'Accesorios'
#         elif category in ['Colección']:
#             return 'Colección'
#         elif category in ['Sale !']:
#             return 'Sale!'
#         elif category in ['THE END OF $TW']:
#             return 'The end of $TW'
#         elif category in ['Mallas y Bermudas']:
#             return 'Mallas y bermudas'
#         elif category in ['Gorras', 'Beanies']:
#             return 'Gorras y Beanies'
#         else:
#             return category


#     PRODUCTS_XPATHS = [
#         "//div[contains(@data-component,'product-list-item')]",
#         "//div[contains(@class,'item-description')]",
#         "//div[@class='product-row row']/div",
#     ]

#     LINK_XPATHS = [
#         ".//a",
#     ]

#     NAME_XPATHS = [
#         "//h1",
#     ]

#     PRICE_XPATHS = [
#         "//span[@id='price_display']",
#         "//h3[@id='price_display']",
#         "//div[@class='js-price-display']",
#         "//h2[contains(@class,'js-price-display')]"
#     ]

#     IMAGES_XPATHS = [
#         "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]/div/a/img",
#         "//div[@class='cloud-zoom-wrap']/a",
#         "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]/div/a",
#         "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]//img",
#     ]

#     WORDS_XPATHS = [
#         "//div[contains(@class,'js-product-left-col')]/div[contains(@class,'product-description')]/p",
#         "//div[contains(@class,'product-description')]/p",
#         "//div[@class='user-content']//p",
#     ]

#     SIZES_XPATHS = [
#         # "//div[contains(@data-variant,'Talle')]/div/a/span",
#         "//form[@id='product_form']//div[contains(@data-variant,'Talle')]/div/a/span",
#         "//form[@id='product_form']//label[text()[contains(.,'Talle')]]/following-sibling::select/option",
#         "//form[@id='product_form']//label[text()[contains(.,'mero')]]/following-sibling::select/option"
#     ]

#     COLORS_XPATHS = [
#         # "//div[contains(@data-variant,'Color')]/div/a/span",
#         # "//form[@id='product_form']//label[text()='Color']/following-sibling::select/option",
#         # "//span[text()[contains(.,'Color')]]/parent::label/following-sibling::div/select[contains(@class,'js-variation-option')]/option"
#         "//span[text()[contains(.,'Color')]]/parent::label/following-sibling::div/select/option",
#         "//form[@id='product_form']//label[text()[contains(.,'Color')]]/following-sibling::select/option",
#     ]

#     BUY_BUTTON_XPATHS = [
#         "//div[contains(@class,'product-buy-container')]/input",
#         "//form[@id='product_form']//input[contains(@class,'js-addtocart')]",
#     ]

#     CATEGORY_XPATHS = [
#         "//a[@class='breadcrumb-crumb']",
#         "//div[contains(@class,'breadcrumbs')]/a",
#     ]

#     user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"

#     options = webdriver.ChromeOptions()
#     options.headless = True
#     options.add_argument(f'user-agent={user_agent}')
#     options.add_argument("--window-size=1920,1080")
#     options.add_argument('--ignore-certificate-errors')
#     options.add_argument('--allow-running-insecure-content')
#     options.add_argument("--disable-extensions")
#     options.add_argument("--proxy-server='direct://'")
#     options.add_argument("--proxy-bypass-list=*")
#     options.add_argument("--start-maximized")
#     options.add_argument('--disable-gpu')
#     options.add_argument('--disable-dev-shm-usage')
#     options.add_argument('--no-sandbox')
#     # driver = webdriver.Chrome(options=options)

#     driver = webdriver.Chrome(
#         executable_path='./chromedriver.exe', options=options)

#     stores = [

#         #  if '/password/' in url means that the store is in maintenance mode

#         # 'https://www.psicodelia.com.ar/productos/'
#         # 'https://tienda.tuespacioorganizado.com.ar/cocina/'
#         # 'https://losandes2.mitiendanube.com/vinos/',
#         # 'https://casamartinez.mitiendanube.com/electronica/television/',
#         # 'https://centralcafe.mitiendanube.com/'
#         # # Belforte
#         "https://www.belforte.com.ar/sandalias/",
#         # "https://www.belforte.com.ar/borcegos/",
#         # "https://www.belforte.com.ar/botinetas/",
#         # "https://www.belforte.com.ar/crema-para-cueros/",

#         # # Langlois
#         # "https://langlois.com.ar/sombreros1/",

#         # # arriba
#         # "https://langlois.com.ar/arriba/camisas/",
#         # "https://langlois.com.ar/arriba/remeras/",
#         # "https://langlois.com.ar/arriba/vestidos/",
#         # "https://langlois.com.ar/arriba/tops/",
#         # "https://langlois.com.ar/arriba/abrigo/",
#         # "https://langlois.com.ar/arriba/trajes-de-bano/",

#         # # abajo
#         # "https://langlois.com.ar/abajo/pantalon/",
#         # "https://langlois.com.ar/abajo/short/",
#         # "https://langlois.com.ar/abajo/bermuda/",
#         # "https://langlois.com.ar/abajo/faldas/",

#         # "https://langlois.com.ar/accesorios/",
#         # "https://langlois.com.ar/trajes/",
#         # "https://langlois.com.ar/sale/",

#         # Forever Bastard
#         # "https://www.foreverbastard.com/the-end-of-tw/remeras/",
#         # "https://www.foreverbastard.com/the-end-of-tw/camisas/",
#         # "https://www.foreverbastard.com/the-end-of-tw/beach-shorts/",
#         # "https://www.foreverbastard.com/the-end-of-tw/buzos-hoodies1/",
#         # "https://www.foreverbastard.com/the-end-of-tw/accesorios1/",


#         # # # Shamrock
#         # "https://www.shamrock.com.ar/productos/",

#         # "https://www.shamrock.com.ar/remeras-oversize/",
#         # "https://www.shamrock.com.ar/remeras/",

#         # "https://www.shamrock.com.ar/abrigos/",
#         # "https://www.shamrock.com.ar/abrigos/buzos/",
#         # "https://www.shamrock.com.ar/abrigos/camperas/",
#         # "https://www.shamrock.com.ar/abrigos/camperas-de-abrigo/",
#         # "https://www.shamrock.com.ar/abrigos/sweaters/",

#         # "https://www.shamrock.com.ar/pantalones/",
#         # "https://www.shamrock.com.ar/pantalones/jeans/",
#         # "https://www.shamrock.com.ar/pantalones/chinos/",
#         # "https://www.shamrock.com.ar/pantalones/joggings/",
#         # "https://www.shamrock.com.ar/pantalones/joggers/",
#         # "https://www.shamrock.com.ar/pantalones/bermudas/",
#         # "https://www.shamrock.com.ar/pantalones/short-de-bano/",

#         # "https://www.shamrock.com.ar/camisas/",
#         # "https://www.shamrock.com.ar/camisas/manga-corta/",
#         # "https://www.shamrock.com.ar/gorras/",

#         # "https://www.shamrock.com.ar/ropa-interior/",
#         # "https://www.shamrock.com.ar/zapatillas/",
#         # "https://www.shamrock.com.ar/conjuntos/",
#         # "https://www.shamrock.com.ar/accesorios/",

#         # Insublime
#         # "https://www.insublime.ar/hoodie/",
#         # "https://www.insublime.ar/remes/",
#         # # "https://www.insublime.ar/giftcard/",
#         # "https://www.insublime.ar/sale/",

#         # # Helsinki Mochilas

#         # # Malibu
#         # "https://www.malibuoutfitters.com.ar/coleccion/musculosas1/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/remeras2/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/camisas/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/bermudas/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/pantalones/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/jeans1/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/shorts-de-bano/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/sweaters/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/abrigos/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/ponchos-ruanas/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/tunicas-y-kimonos/",
#         # "https://www.malibuoutfitters.com.ar/coleccion/calzado/",

#         # "https://www.malibuoutfitters.com.ar/accesorios1/aros1/",
#         # "https://www.malibuoutfitters.com.ar/accesorios1/bandanas1/",
#         # "https://www.malibuoutfitters.com.ar/accesorios1/bolsos1/",
#         # "https://www.malibuoutfitters.com.ar/accesorios1/cadenas/",
#         # "https://www.malibuoutfitters.com.ar/accesorios1/collares1/",
#         # "https://www.malibuoutfitters.com.ar/accesorios1/gafas1/",
#         # "https://www.malibuoutfitters.com.ar/accesorios1/gorras1/",
#         # "https://www.malibuoutfitters.com.ar/accesorios1/medias1/",
#         # "https://www.malibuoutfitters.com.ar/accesorios1/pulseras1/",
#         # "https://www.malibuoutfitters.com.ar/accesorios1/sombreros1/",

#         # # Rock That Body
#         # "https://www.rockthatbody.com.ar/pantalones1/",
#         # "https://www.rockthatbody.com.ar/tops/",
#         # "https://www.rockthatbody.com.ar/pollera/",
#         # "https://www.rockthatbody.com.ar/joguineta/",
#         # "https://www.rockthatbody.com.ar/mameluco/",
#         # "https://www.rockthatbody.com.ar/calzado/",
#         # "https://www.rockthatbody.com.ar/accesorios/",
#         # "https://www.rockthatbody.com.ar/jumper-jardineros/",
#         # "https://www.rockthatbody.com.ar/body/",
#         # "https://www.rockthatbody.com.ar/remeras/",
#         # "https://www.rockthatbody.com.ar/trajes-de-bano/",
#         # "https://www.rockthatbody.com.ar/short/",
#         # "https://www.rockthatbody.com.ar/chalecos/",
#         # "https://www.rockthatbody.com.ar/vestidos/",
#         # "https://www.rockthatbody.com.ar/corset/",
#         # "https://www.rockthatbody.com.ar/bermuda/",

#         # # Satana
#     #     "https://www.satanaclothes.com/vestidos/",
#     #     "https://www.satanaclothes.com/faldas/",
#     #     "https://www.satanaclothes.com/remeras-y-tops/",
#     #     "https://www.satanaclothes.com/bodys/",
#     #     "https://www.satanaclothes.com/calzas/",
#     #     "https://www.satanaclothes.com/camisas/",
#     #     "https://www.satanaclothes.com/pantalones/",
#     #     "https://www.satanaclothes.com/shorts-y-bermudas/",
#     #     "https://www.satanaclothes.com/buzos-y-sweaters/",
#     #     "https://www.satanaclothes.com/camperas/",
#     #     "https://www.satanaclothes.com/monoprendas/",
#     #     "https://www.satanaclothes.com/accesorios1/",

#     #     # # # delusion

#     #     # # avystrac
#     #     "https://avystrac.com.ar/buzos/",
#     #     "https://avystrac.com.ar/remeras/",
#     #     "https://avystrac.com.ar/shorts/",
#     #     "https://avystrac.com.ar/accesorios/",
#     #     # "https://avystrac.com.ar/preguntas-frecuentes/",

#     #     # # Mystic
#     #     "https://mysticba.com/buzos/",
#     #     "https://mysticba.com/remeras/",
#     #     "https://mysticba.com/accesorios/",

#     #     # # # saintrebels

#     #     # # # Mustaqe
#     #     "https://www.mustaqe.com.ar/shorts/",
#     #     "https://www.mustaqe.com.ar/hoodie-buzos/",
#     #     "https://www.mustaqe.com.ar/pantalones/",
#     #     "https://www.mustaqe.com.ar/remeron/",
#     #     "https://www.mustaqe.com.ar/conjuntos/",

#     #     # # # ACCESORIOS
#     #     "https://www.mustaqe.com.ar/accesorios/pilusos/",
#     #     "https://www.mustaqe.com.ar/accesorios/gorros/",
#     #     "https://www.mustaqe.com.ar/accesorios/medias/",
#     #     "https://www.mustaqe.com.ar/accesorios/cadenas/",
#     #     "https://www.mustaqe.com.ar/accesorios/pasamontanas1/",

#     #     # # MUSTAQE KIDS
#     #     "https://www.mustaqe.com.ar/ninos/conjuntos1/",
#     #     "https://www.mustaqe.com.ar/ninos/remeras/",
#     #     "https://www.mustaqe.com.ar/ninos/shorts1/",

#     #     # # Tacitadete
#     #     "https://tacitadete.mitiendanube.com/buzos/",
#     #     "https://tacitadete.mitiendanube.com/camperas/",
#     #     "https://tacitadete.mitiendanube.com/pants/",
#     #     "https://tacitadete.mitiendanube.com/tops/",
#     #     "https://tacitadete.mitiendanube.com/remerones/",
#     #     "https://tacitadete.mitiendanube.com/shorts/",

#     #     # # # murderdoll
#     #     "https://www.murderdoll.com.ar/chokers/",
#     #     "https://www.murderdoll.com.ar/chokers-cintas/",
#     #     "https://www.murderdoll.com.ar/collares/",
#     #     "https://www.murderdoll.com.ar/aros/",
#     #     "https://www.murderdoll.com.ar/anillos/",
#     #     "https://www.murderdoll.com.ar/pulseras-de-tachas/",
#     #     "https://www.murderdoll.com.ar/otros-accesorios/",
#     #     "https://www.murderdoll.com.ar/pulseras/",
#     #     # "https://www.murderdoll.com.ar/giftcards/",

#     #     # # collares

#     #     "https://www.murderdoll.com.ar/collares/collares-de-acero-quirurgico/",
#     #     "https://www.murderdoll.com.ar/collares/collares-cadenas-grandes/",

#     # #     # # JimmyRebel
#         # "https://www.jimmyrebel.com.ar/remeras/",
#     #     "https://www.jimmyrebel.com.ar/shorts-y-bermudas/",
#     #     "https://www.jimmyrebel.com.ar/accesorios/",
#         # "https://www.jimmyrebel.com.ar/buzos/",
#         # "https://www.jimmyrebel.com.ar/gorras/",
#         # "https://www.jimmyrebel.com.ar/beanies/",
#         # "https://www.jimmyrebel.com.ar/pantalones/",
#         # "https://www.jimmyrebel.com.ar/gift-card/",
#         # "https://www.jimmyrebel.com.ar/home/",
#     #     "https://www.jimmyrebel.com.ar/sale/",
#     #     "https://www.jimmyrebel.com.ar/royalty/",

#     #     # HyteApparel
#     #     "https://www.hyteapparel.com.ar/hoodies/",
#     #     "https://www.hyteapparel.com.ar/remeras/",
#     #     "https://www.hyteapparel.com.ar/bermudas/",
#     #     "https://www.hyteapparel.com.ar/camisetas-oversize/",
#     #     "https://www.hyteapparel.com.ar/pantalones/",
#     ]

#     # stores = [
#     #     "https://www.belforte.com.ar/search/?q=GILDA", #                    10.8 sec per product
#     #     "https://langlois.com.ar/productos/", #                             7.3 sec per product
#     #     "https://www.foreverbastard.com/", #                                11.2 sec per product
#     #     "https://www.shamrock.com.ar/pantalones/", #                        6.2 sec per product
#     #     "https://baib.com.ar/productos/", #                                 4.2 sec per product
#     #     "https://www.insublime.ar/hoodie/anime/", #                         8.0 sec per product
#     #     "https://helsinki.com.ar/productos/", #                             20.0 sec per product
#     #     "https://overchaosstore.mitiendanube.com/buzos/", #                 9.2 sec per product
#     #     "https://www.malibuoutfitters.com.ar/coleccion/shorts-de-bano/", #  7.4 sec per product
#     #     "https://rockthatbody.com.ar/tops/", #                              5.2 sec per product
#     #     "https://www.satanaclothes.com/accesorios1/",

#     #     "https://delusion.com.ar/productos/",
#     #     "https://offstylear.mitiendanube.com/productos/",
#     #     "https://avystrac.com.ar/shorts/",
#     #     "https://mysticba.com/",
#     #     "https://www.saintrebels.com/productos/",

#     #     "https://www.mustaqe.com.ar/hoodie-buzos/",
#     #     'https://www.mustaqe.com.ar/accesorios/',
#     #     "https://tacitadete.mitiendanube.com/remerones/",
#     #     "https://www.murderdoll.com.ar/collares/",
#     #     "https://www.jimmyrebel.com.ar/",
#     #     "https://www.hyteapparel.com.ar/hoodies/",

#     #     # "https://www.tiendacry.com.ar/ropa/", #                             4.4 sec per product    # error at selecte size
#     #     # # "https://onekickz.com/ar/stock1/sneakers-mpage2/", #                6.0 sec per product  # 404 error
#     #     # "https://weirdproject.com.ar/productos/",                               # error at products
#     # ]

#     was_saved = False

#     for store in stores:
#         driver.get(store)
#         driver.maximize_window()

#         error_log_list = []
#         products_list = []
#         colors_list = []
#         sizes_list = []

#         def waitForElement(xpath, driver, max_time, multi):
#             if multi == True:
#                 result = WebDriverWait(driver, max_time).until(
#                     EC.presence_of_all_elements_located((By.XPATH, xpath)))
#                 return result
#             else:
#                 result = WebDriverWait(driver, max_time).until(
#                     EC.presence_of_element_located((By.XPATH, xpath)))
#                 return result

#         lucky_product_xpath = 0
#         lucky_link_xpath = 0
#         lucky_name_xpath = 0
#         lucky_price_xpath = 0
#         lucky_images_xpath = 0
#         lucky_words_xpath = 0
#         lucky_category_xpath = 0
#         lucky_sizes_xpath = 0
#         lucky_colors_xpath = 0
#         lucky_buy_button_xpath = 0

#         products = []
#         links = []

#         total_name_time = 0
#         total_price_time = 0
#         total_images_time = 0
#         total_words_time = 0
#         total_category_time = 0
#         total_buy_button_time = 0
#         total_sizes_time = 0

#         # Get Products

#         try:
#             products_time = time.time()
#             products = waitForElement(
#                 PRODUCTS_XPATHS[lucky_product_xpath], driver, 0.2, True)
#             products_time = time.time() - products_time
#             print(len(products), 'products found in',
#                   products_time, 'seconds with lucky xpath')

#         except:
#             for product_xpath in PRODUCTS_XPATHS:
#                 try:
#                     products_time = time.time()
#                     products = waitForElement(product_xpath, driver, 0.2, True)
#                     products_time = time.time() - products_time
#                     print(len(products), 'products found in',
#                           products_time, 'seconds')
#                     lucky_product_xpath = PRODUCTS_XPATHS.index(product_xpath)
#                     break
#                 except:
#                     pass

#         if len(products) <= 0:
#             # go to next store
#             continue

#         else:

#             scraping_time = time.time()

#             for product in products:
#             # for i in range(0, 1):
#             #     product = products[i]
#                 try:
#                     link_time = time.time()
#                     link = waitForElement(
#                         LINK_XPATHS[lucky_link_xpath], product, 0.03, False).get_attribute('href')
#                     link_time = time.time() - link_time
#                     if 'tabla-de-talles' not in link:
#                         print('Link found in', link_time,
#                               'seconds with lucky xpath')
#                         links.append(link)
#                 except:
#                     for link_xpath in LINK_XPATHS:
#                         try:
#                             link_time = time.time()
#                             link = waitForElement(
#                                 link_xpath, product, 0.05, False).get_attribute('href')
#                             link_time = time.time() - link_time
#                             if 'tabla-de-talles' not in link:
#                                 print('Link found in', link_time, 'seconds')
#                                 links.append(link)
#                                 lucky_link_xpath = LINK_XPATHS.index(
#                                     link_xpath)
#                                 break
#                         except:
#                             pass

#                 if len(links) == 0:
#                     print('No link found')
#                     driver.quit()
#                     exit()

#             # links = ['https://www.satanaclothes.com/productos/camisa-smith/']
#             links = ['https://www.murderdoll.com.ar/productos/aros-skull-swords/']
#             for link in links:
#                 driver.get(link)
#                 driver.maximize_window()

#                 name = None
#                 price = None
#                 images = None
#                 words = None
#                 category = None
#                 sizes = None
#                 buy_button = None
#                 colors = None

#                 # Get Name
#                 try:
#                     name_time = time.time()
#                     name = waitForElement(
#                         NAME_XPATHS[lucky_name_xpath], driver, 0.25, False).text
#                     name_time = time.time() - name_time
#                     print('Name found in', name_time,
#                           'seconds with lucky xpath')
#                     print('\n Name:', name)

#                 except:
#                     for name_xpath in NAME_XPATHS:
#                         try:
#                             name_time = time.time()
#                             name = waitForElement(
#                                 name_xpath, driver, 0.25, False).text
#                             name_time = time.time() - name_time
#                             print('Name found in', name_time, 'seconds')
#                             print('\n Name:', name)
#                             lucky_name_xpath = NAME_XPATHS.index(name_xpath)
#                             break
#                         except:
#                             pass
#                 if name == None:
#                     error_log_list.append({
#                         'error at': 'name',
#                         'link': driver.current_url,
#                         'time': time.time(),
#                         'xpath': name_xpath
#                     })

#                 # Get Price
#                 try:
#                     price_time = time.time()
#                     price = waitForElement(
#                         PRICE_XPATHS[lucky_price_xpath], driver, 0.05, False).text
#                     price_time = time.time() - price_time
#                     print('Price found in', price_time,
#                           'seconds with lucky xpath')
#                 except:
#                     for price_xpath in PRICE_XPATHS:
#                         try:
#                             price_time = time.time()
#                             price = waitForElement(
#                                 price_xpath, driver, 0.05, False).text
#                             price_time = time.time() - price_time
#                             print('Price found in', price_time, 'seconds')
#                             lucky_price_xpath = PRICE_XPATHS.index(price_xpath)
#                             break
#                         except:
#                             pass
#                 if price == None:
#                     error_log_list.append({
#                         'error at': 'price',
#                         'link': driver.current_url,
#                         'time': time.time(),
#                         'xpath': price_xpath
#                     })

#                 else:
#                     if price == '' or None:
#                         price = '0'

#                     price = price.replace('$', '')
#                     price = price.replace('.', '')
#                     price = price.split(',')[0]
#                     price = float(price)

#                 # Get Images
#                 images_list = []
#                 try:
#                     images_time = time.time()
#                     images = waitForElement(
#                         IMAGES_XPATHS[lucky_images_xpath], driver, 0.23, True)
#                     images_time = time.time() - images_time

#                     for image in images:
#                         if image.tag_name == 'a':
#                             if 'http' and not 'placeholder' in image.get_attribute('href'):
#                                 images_list.append(image.get_attribute('href'))
#                             else:
#                                 raise Exception('Image href is not a link')
#                         elif image.tag_name == 'img':
#                             srcset = image.get_attribute('srcset')
#                             srcset_items = srcset.split(',')
#                             last_item = srcset_items[-1].strip().split(' ')[0]

#                             if 'placeholder' not in last_item:
#                                 images_list.append(last_item)
#                             else:
#                                 raise Exception(
#                                     'Image src or srcset is not a link or contains a placeholder')
#                         else:
#                             raise Exception('Image tag name is not a or img')

#                     print('Images found in', images_time, 'seconds with lucky xpath')

#                 except:
#                     for images_xpath in IMAGES_XPATHS:
#                         try:
#                             images_time = time.time()
#                             images = waitForElement(
#                                 images_xpath, driver, 0.23, True)
#                             images_time = time.time() - images_time

#                             for image in images:
#                                 if image.tag_name == 'a':
#                                     if 'http' and not 'placeholder' in image.get_attribute('href'):
#                                         images_list.append(
#                                             image.get_attribute('href'))
#                                     else:
#                                         raise Exception(
#                                             'Image href is not a link')
#                                 elif image.tag_name == 'img':
#                                     srcset = image.get_attribute('srcset')
#                                     srcset_items = srcset.split(',')
#                                     last_item = srcset_items[-1].strip().split(' ')[
#                                         0]

#                                     if 'placeholder' not in last_item:
#                                         images_list.append(last_item)
#                                     else:
#                                         raise Exception(
#                                             'Image src or srcset is not a link or contains a placeholder')
#                                 else:
#                                     raise Exception(
#                                         'Image tag name is not a or img')

#                             print('Images found in', images_time, 'seconds')
#                             lucky_images_xpath = IMAGES_XPATHS.index(
#                                 images_xpath)
#                         except:
#                             pass
#                 if images == None:
#                     error_log_list.append({
#                         'error at': 'images',
#                         'link': driver.current_url,
#                         'time': time.time(),
#                         'xpath': images_xpath
#                     })

#                 # Get Description
#                 description = []
#                 try:
#                     words_time = time.time()
#                     words = waitForElement(
#                         WORDS_XPATHS[lucky_words_xpath], driver, 0.2, True)
#                     words_time = time.time() - words_time
#                     print(len(words), 'words found in',
#                           words_time, 'seconds with lucky xpath')
#                 except:
#                     for words_xpath in WORDS_XPATHS:
#                         try:
#                             words_time = time.time()
#                             words = waitForElement(
#                                 words_xpath, driver, 0.2, True)
#                             words_time = time.time() - words_time
#                             print(len(words), 'words found in',
#                                   words_time, 'seconds')
#                             lucky_words_xpath = WORDS_XPATHS.index(words_xpath)
#                             break
#                         except:
#                             pass

#                 if words != None:
#                     for word in words:
#                         description.append(word.text)

#                     description = [word for word in description if word != ' ']

#                     if 'belforte.com.ar' in driver.current_url:
#                         description = description[:-4]

#                     description = ' '.join(description)
#                     description = description.replace(' -', '\n -')
#                     description = description.replace('  ', '\n')
#                     description = description.replace('. ', '\n')

#                 # Get Category
#                 try:
#                     category_time = time.time()
#                     category = waitForElement(
#                         CATEGORY_XPATHS[lucky_category_xpath], driver, 0.3, True)
#                     category_time = time.time() - category_time

#                     # if category is more than one, iterate ignoring 'inicio' and 'home'
#                     print(len(category))
#                     if len(category) > 1:
#                         print('more than one category')
#                         for item in category:
#                             print(item.text)
#                             if item.text.lower() != 'inicio' and item.text.lower() != 'home':
#                                 category = item.text
#                                 category = map_category(category)
#                                 print('category found ' + category)
#                                 break
#                     else:
#                         category = category[0].text
#                         category = map_category(category)


#                     print('Category found in', category_time, 'seconds with lucky xpath')
#                 except:
#                     for category_xpath in CATEGORY_XPATHS:
#                         try:
#                             category_time = time.time()
#                             category = waitForElement(
#                                 category_xpath, driver, 0.3, True)

#                             # if category is more than one, iterate ignoring 'inicio' and 'home'
#                             print(len(category))
#                             if len(category) > 1:
#                                 print('more than one category')
#                                 for item in category:
#                                     print(item.text)
#                                     if item.text.lower() != 'inicio' and item.text.lower() != 'home':
#                                         category = item.text
#                                         category = map_category(category)
#                                         print('category found ' + category)
#                                         break

#                             category_time = time.time() - category_time
#                             print('Category found in', category_time, 'seconds')
#                             lucky_category_xpath = CATEGORY_XPATHS.index(
#                                 category_xpath)
#                             break
#                         except:
#                             pass
#                 if category == None:
#                     error_log_list.append({
#                         'error at': 'category',
#                         'link': driver.current_url,
#                         'time': time.time(),
#                         'xpath': category_xpath
#                     })

#                 # Get Buy Button
#                 try:
#                     buy_button_time = time.time()
#                     buy_button = waitForElement(
#                         BUY_BUTTON_XPATHS[lucky_buy_button_xpath], driver, 0.01, False)
#                     buy_button_time = time.time() - buy_button_time
#                     print('Buy button found in', buy_button_time, 'seconds with lucky xpath')
#                 except:
#                     for buy_button_xpath in BUY_BUTTON_XPATHS:
#                         try:
#                             buy_button_time = time.time()
#                             buy_button = waitForElement(
#                                 buy_button_xpath, driver, 0.01, False)
#                             buy_button_time = time.time() - buy_button_time
#                             print('Buy button found in',
#                                   buy_button_time, 'seconds')
#                             lucky_buy_button_xpath = BUY_BUTTON_XPATHS.index(
#                                 buy_button_xpath)
#                             break
#                         except:
#                             pass
#                 if buy_button == None:
#                     error_log_list.append({
#                         'error at': 'buy button',
#                         'link': driver.current_url,
#                         'time': time.time(),
#                         'xpath': buy_button_xpath
#                     })

#                 else:
#                     # Get Colors
#                     colors_list = []
#                     try:
#                         colors_time = time.time()
#                         colors = waitForElement(
#                             COLORS_XPATHS[lucky_colors_xpath], driver, 0.1, True)
#                         colors_time = time.time() - colors_time
#                         print(len(colors), 'colors found in',
#                               colors_time, 'seconds with lucky xpath')
#                     except:
#                         for colors_xpath in COLORS_XPATHS:
#                             try:
#                                 colors_time = time.time()
#                                 colors = waitForElement(
#                                     colors_xpath, driver, 0.1, True)
#                                 colors_time = time.time() - colors_time
#                                 print(len(colors), 'colors found in',
#                                       colors_time, 'seconds')
#                                 lucky_colors_xpath = COLORS_XPATHS.index(
#                                     colors_xpath)
#                                 break
#                             except:
#                                 pass
#                     if colors == None:
#                         # error_log_list.append({
#                         #     'error at': 'colors',
#                         #     'link': driver.current_url,
#                         #     'time': time.time(),
#                         #     'xpath': colors_xpath
#                         # })

#                         # # Get Sizes Without color:unique
#                         sizes_list = []
#                         try:
#                             sizes_time = time.time()
#                             sizes = waitForElement(
#                                 SIZES_XPATHS[lucky_sizes_xpath], driver, 0.02, True)
#                             sizes_time = time.time() - sizes_time
#                             print(len(sizes), 'sizes found in',
#                                   sizes_time, 'seconds with lucky xpath')
#                         except:
#                             for sizes_xpath in SIZES_XPATHS:
#                                 try:
#                                     sizes_time = time.time()
#                                     sizes = waitForElement(
#                                         sizes_xpath, driver, 0.02, True)
#                                     sizes_time = time.time() - sizes_time
#                                     print(len(sizes), 'sizes found in',
#                                           sizes_time, 'seconds')
#                                     lucky_sizes_xpath = SIZES_XPATHS.index(
#                                         sizes_xpath)
#                                     break
#                                 except:
#                                     pass
#                         if sizes == None:
#                             color_obj = {}
#                             color_obj['color'] = 'Unico'
#                             size_obj = {}
#                             size_obj['size'] = 'Unico'
#                             if buy_button.get_attribute('disabled'):
#                                 size_obj['stock'] = 0
#                             else:
#                                 size_obj['stock'] = 10

#                             sizes_list.append(size_obj)
#                             color_obj['sizes'] = [size_obj]

#                             colors_list.append(color_obj)

#                         else:
#                             # if newsletter is present, close it
#                             try:
#                                 newsletter = waitForElement("//div[@class='_dp_close']", driver, 0.01, False)
#                                 newsletter.click()
#                                 print('newsletter closed')
#                             except:
#                                 pass

#                             for size in sizes:
#                                 color_obj = {}
#                                 color_obj['color'] = 'Unico'
#                                 size_obj = {}

#                                 size_obj['size'] = size.text
#                                 size.click()
#                                 if buy_button.get_attribute('disabled'):
#                                     size_obj['stock'] = 0
#                                 else:
#                                     size_obj['stock'] = 10
#                                 sizes_list.append(size_obj)
#                                 color_obj['sizes'] = sizes_list
#                             colors_list.append(color_obj)

#                     else:
#                         for color in colors:
#                             color_obj = {}
#                             try:
#                                 color_obj['color'] = color.get_attribute(
#                                     'value').capitalize()
#                                 is_span = WebDriverWait(driver, 0.1).until(EC.presence_of_element_located(
#                                     (By.XPATH, "//div[contains(@data-variant,'Color')]/div/a/span[@data-name='" + color.get_attribute("value") + "']")))
#                                 is_span.click()
#                                 sleep(1)
#                             except:
#                                 color_obj['color'] = color.get_attribute(
#                                     'value').capitalize()
#                                 color.click()
#                                 sleep(1)

#                             # Get Sizes
#                             sizes_list = []
#                             try:
#                                 sizes_time = time.time()
#                                 sizes = waitForElement(
#                                     SIZES_XPATHS[lucky_sizes_xpath], driver, 0.02, True)
#                                 sizes_time = time.time() - sizes_time
#                                 print(len(sizes), 'sizes found in',
#                                       sizes_time, 'seconds with lucky xpath')
#                             except:
#                                 for sizes_xpath in SIZES_XPATHS:
#                                     try:
#                                         sizes_time = time.time()
#                                         sizes = waitForElement(
#                                             sizes_xpath, driver, 0.02, True)
#                                         sizes_time = time.time() - sizes_time
#                                         print(len(sizes), 'sizes found in',
#                                               sizes_time, 'seconds')
#                                         lucky_sizes_xpath = SIZES_XPATHS.index(
#                                             sizes_xpath)
#                                         break
#                                     except:
#                                         pass
#                             if sizes == None:
#                                 size_obj = {}
#                                 size_obj['size'] = 'Unico'
#                                 if buy_button.get_attribute('disabled'):
#                                     size_obj['stock'] = 0
#                                 else:
#                                     size_obj['stock'] = 10
#                                 sizes_list.append(size_obj)
#                                 color_obj['sizes'] = sizes_list
#                                 colors_list.append(color_obj)
#                             else:
#                                 # if newsletter is present, close it
#                                 try:
#                                     newsletter = waitForElement("//div[@class='_dp_close']", driver, 0.01, False)
#                                     newsletter.click()
#                                     print('newsletter closed')
#                                 except:
#                                     pass

#                                 for size in sizes:
#                                     size_obj = {}
#                                     size_obj['size'] = size.text
#                                     size.click()
#                                     if buy_button.get_attribute('disabled'):
#                                         size_obj['stock'] = 0
#                                     else:
#                                         size_obj['stock'] = 10
#                                     sizes_list.append(size_obj)
#                                     color_obj['sizes'] = sizes_list
#                             colors_list.append(color_obj)

#                 # product_JSON = {
#                 #     'name': name,
#                 #     'price': price,
#                 #     'images': len(images),
#                 #     'description': description,
#                 #     'category': category,
#                 #     'link': driver.current_url,
#                 #     'time_scraped': time.time()
#                 # }
#                 # products_list.append(product_JSON)

#                 user = User.objects.get(id=1)

#                 subCategory = ''
#                 if name:
#                     # if name.lower() contains 'remeron' set subcategory to 'Remerones'
#                     if 'remeron' in name.lower():
#                         subCategory = 'Remerones'


#                 # if some field except description is none set is_active to False
#                 status = True
#                 if not name or not price or not images or not category or not buy_button:
#                     # print('name:', name, '\n')
#                     # print('price:', price, '\n')
#                     # print('images:', len(images), '\n')
#                     # print('category:', category, '\n')
#                     # # print('sizes:', len(sizes), '\n')
#                     # print('buy_button:', buy_button, '\n')
#                     # print('colors:', colors, '\n')

#                     status = False


#                 # if product doesn't exist, create it
#                 try:
#                     product = Product.objects.get(original_url=link)
#                     product.is_active = status
#                     product.save()
#                 except:
#                     product = Product(
#                         user=user,
#                         name=name,
#                         price=price,
#                         description=description,
#                         category=category,
#                         subCategory=subCategory,
#                         original_url=link,
#                         is_scraped=True,
#                         is_active=status,
#                     )

#                     product.save()


#                 # update product price
#                 if product.price != price:
#                     product.price = price
#                     product.save()

#                 # if product had subcategory then don't update category
#                 if product.subCategory:
#                     pass
#                 else:
#                     # # update product category
#                     if product.category != category:
#                         product.category = category
#                         product.save()

#                     # update product subcategory
#                     if product.subCategory != subCategory:
#                         product.subCategory = subCategory
#                         product.save()


#                 for image in images_list:
#                     if image.startswith('//'):
#                                 image = 'https:' + image
#                     # if image ends with #, remove it from the list
#                     if image.endswith('#'):
#                         images_list.remove(image)
#                         continue

#                     # if image doesn't exist, create it
#                     try:
#                         product_image = ProductImage.objects.get(
#                             product=product, original_url=image)
#                         continue
#                     except:
#                         try:
#                             image_content = requests.get(image).content
#                             image_name = image.split('/')[-1]
#                             image_file = ContentFile(image_content, image_name)
#                             img = Image.open(image_file)
#                             img.verify()

#                             # the image is valid

#                             product_image = ProductImage(
#                                 product=product,
#                                 image=image_file,
#                                 original_url=image
#                             )
#                             product_image.save()
#                             print('image saved')
#                         except Exception as e:
#                             # the image is invalid
#                             print('image is invalid')
#                             pass

#                 if colors_list == [] or colors_list == None:
#                     colors_list = [{'color': 'Unico', 'sizes': [
#                         {'size': 'Unico', 'stock': 10}]}]

#                 for color in colors_list:
#                     # if color doesn't exist, create it
#                     try:
#                         color_obj = Color.objects.get(color=color['color'])
#                     except:
#                         color_obj = Color(
#                             color=color['color']
#                         )
#                         color_obj.save()

#                     for size in color['sizes']:
#                         # if size doesn't exist, create it
#                         try:
#                             size_obj = Size.objects.get(size=size['size'])
#                         except:
#                             size_obj = Size(
#                                 size=size['size']
#                             )
#                             size_obj.save()

#                         # if product_attribute doesn't exist, create it
#                         try:
#                             product_attribute = ProductAttribute.objects.get(
#                                 product=product, color=color_obj, size=size_obj)
#                             product_attribute.stock = size['stock']
#                             product_attribute.save()
#                             continue
#                         except:
#                             product_attribute = ProductAttribute(
#                                 product=product,
#                                 stock=size['stock']
#                             )

#                             product_attribute.save()
#                             product_attribute.color.add(color_obj)
#                             product_attribute.size.add(size_obj)

#                 print('product saved')

#                 # total_name_time = total_name_time + name_time
#                 # total_price_time = total_price_time + price_time
#                 # total_images_time = total_images_time + images_time
#                 # total_words_time = total_words_time + words_time
#                 # total_category_time = total_category_time + category_time
#                 # total_buy_button_time = total_buy_button_time + buy_button_time
#                 # total_sizes_time = total_sizes_time + sizes_time

#             print(len(error_log_list), 'errors_log found')
#             # print(len(products), 'products found')
#             # print(len(links), 'links found')

#             # print('average name time:', total_name_time / len(products))
#             # print('average price time:', total_price_time / len(products))
#             # print('average images time:', total_images_time / len(products))
#             # print('average words time:', total_words_time / len(products))
#             # print('average category time:', total_category_time / len(products))
#             # print('average buy button time:', total_buy_button_time / len(products))
#             # print('average sizes time:', total_sizes_time / len(products))

#             # print('average time per element:', (total_name_time + total_price_time + total_images_time + total_words_time + total_category_time + total_buy_button_time + total_sizes_time) / len(products))

#             scraping_time = time.time() - scraping_time
#             print('Scraping time:', scraping_time, 'seconds, average time per product:',
#                   scraping_time / len(products), 'seconds, (', len(products), 'products )')

#         # response_string = 'Scraping time: {} seconds, average time per product: {} seconds, ({} products)'.format(scraping_time, scraping_time / len(products), len(products))
#         # return Response(response_string)

#         # if was_saved == False:
#         #     # Save Error Log
#         #     out_file = open('error_log.json', 'w')
#         #     json.dump(error_log_list, out_file, indent=4)
#         #     out_file.close()

#         #     # Save products
#         #     out_file = open("final_list.json", "w")
#         #     json.dump(products_list, out_file, indent=6)
#         #     out_file.close()
#         #     was_saved = True
#         # else:
#         #     # Save products with the products already scraped
#         #     with open('final_list.json') as json_file:
#         #         data = json.load(json_file)
#         #         for product in products_list:
#         #             data.append(product)
#         #         out_file = open("final_list.json", "w")
#         #         json.dump(data, out_file, indent=6)
#         #         out_file.close()

#         #     # Save Error Log with the errors already scraped
#         #     with open('error_log.json') as json_file:
#         #         data = json.load(json_file)
#         #         for error in error_log_list:
#         #             data.append(error)
#         #         out_file = open("error_log.json", "w")
#         #         json.dump(data, out_file, indent=4)
#         #         out_file.close()

#     # print('final_list.json saved in JSON file ;)')

#     return Response('Scraping finished')
