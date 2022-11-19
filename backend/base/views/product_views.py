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


from base.models import Product, ProductImage, Review, Order, OrderItem, Size
from base.products import products
from base.serializers import ProductSerializer, ProductImageSerializer, SizeSerializer

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
        



@api_view(['GET'])
def scrapeProducts(request):

    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"

    options = webdriver.ChromeOptions()
    options.headless = True
    options.add_argument(f'user-agent={user_agent}')
    options.add_argument("--window-size=1920,1080")
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-running-insecure-content')
    options.add_argument("--disable-extensions")
    options.add_argument("--proxy-server='direct://'")
    options.add_argument("--proxy-bypass-list=*")
    options.add_argument("--start-maximized")
    options.add_argument('--disable-gpu')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--no-sandbox')
    driver = webdriver.Chrome(executable_path="chromedriver.exe", options=options)


    # driver = webdriver.Chrome('./chromedriver.exe')

    driver.get('https://www.satanaclothes.com/productos/?mpage=1')
    driver.maximize_window()

    products_links = []
    products_data = []
    scrolls_counter = 0

    # product-item
    try:
        products = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@data-component,'product-list-item')]"))
        )
    except:
        print('error finding products')
        driver.save_screenshot('error.png')

    for product in products:
        
        try:
            # link = product.find_element(By.XPATH, ".//a").get_attribute('href')
            # products_links.append(link)
            link = WebDriverWait(product, 10).until(EC.presence_of_element_located((By.XPATH, ".//a"))).get_attribute('href')
            products_links.append(link)
        except:
            print('error finding link')
            driver.save_screenshot('error.png')

    for link in products_links:

        driver.get(link)

        scrolls_counter = 0
        while scrolls_counter < 1:
            scrolls_counter += 1
            driver.find_element(By.XPATH, '//body').send_keys(Keys.CONTROL+Keys.END)
            print("scrolled down")
            
            driver.find_element(By.XPATH, '//body').send_keys(Keys.CONTROL+Keys.HOME)
            sleep(random.uniform(2, 3))
            print("scrolled up")

        print('Link: ', link)

        # get product name    
        try:
            name = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//h1"))).text
            print('Name: ', name)
        except:
            print('error finding name')
            driver.save_screenshot('error.png')

        try:
            price = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//span[@id='price_display']"))).text
            print('Price: ', price)
        except:
            print('error finding price')
            driver.save_screenshot('error.png')

        # get product images
        images_list = []

        try:
            images = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, "//div[@class='cloud-zoom-wrap']/a")))
            for image in images:
                images_list.append(image.get_attribute('href'))
                print(image.get_attribute('href'))
        except:
            print('error finding images')
            driver.save_screenshot('error.png')

        # get product description
        description = []
        try:
            words = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class,'js-product-left-col')]/div[contains(@class,'product-description')]/p")))
            for word in words:
                description.append(word.text)
            print('Description: ', description)
        except:
            print('error finding description')
            driver.save_screenshot('error.png')


        # get product sizes
        sizes_list = []
    #     sizes = driver.find_elements(By.XPATH, "//div[contains(@data-variant,'Talle')]/div/a")
        try:
            sizes = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@data-variant,'Talle')]/div/a")))
            
            for size in sizes:
                actions = ActionChains(driver)

            # move to element to click
                try:
                    buy_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class,'product-buy-container')]/input")))
                    actions.move_to_element(buy_button).perform()
                except:
                    print('error finding buy button')
                    driver.save_screenshot('error.png')

                # every size is a object with size and stock
                size_object = {}

                size_object['size'] = size.get_attribute('data-option')
                
                size.click()

                # if size is not available set stock to 0 and continue
                try:
                    buy_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class,'product-buy-container')]/input")))
                    if buy_button.get_attribute('disabled'):
                        size_object['stock'] = 0
                    else:
                        size_object['stock'] = 10
                except:
                    size_object = {}

                print(size_object)
                sizes_list.append(size_object)
        except:
            print('error finding sizes')
            driver.save_screenshot('error.png')


        # get Category
        try:
            category = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//a[@class='breadcrumb-crumb']"))).text
            print('Category: ', category)
        except:
            print('error finding category')
            driver.save_screenshot('error.png')

    # create product model
        product = Product(

            user= request.user,
            brand='Scrapped Product',
            name = name,
            price = price,
            # image = images_list,
            description = description,
            category = category,
            # sizes = sizes_list,
            url = link,
            is_scraped = True,
        )

        product.save()

        # create product image model
        for image in images_list:
            product_image = ProductImage(
                product = product,
                image = image,
            )

            product_image.save()

        # create product size model
        for size in sizes_list:
            product_size = Size(
                product = product,
                size = size['size'],
                stock = size['stock'],
            )

            product_size.save()

    print("scraped product")

    print('Products scraped n saved in products.json ;)')
    driver.quit()





