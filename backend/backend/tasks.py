from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Q, Sum

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from celery import shared_task

from django.contrib.auth.models import User

import requests
from django.core.files.base import ContentFile
from PIL import Image


from base.models import Product, ProductImage, Review, Order, OrderItem, Size, Color, ProductAttribute, ProductView, CartItem, WishlistItem, Cart
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options

import time
from celery import shared_task
from base.models import Product
from itertools import chain


# scrape single product
@shared_task(track_started=True)
def scrape_product(id):
    product = Product.objects.get(id=id)
    link = product.original_url

    # Scrape the product

    PRODUCTS_XPATHS = [
        "//div[contains(@data-component,'product-list-item')]",
        "//div[contains(@class,'item-description')]",
        "//div[@class='product-row row']/div",
    ]

    LINK_XPATHS = [
        ".//a",
    ]

    NAME_XPATHS = [
        "//h1",
    ]

    PRICE_XPATHS = [
        "//span[@id='price_display']",
        "//h3[@id='price_display']",
        "//div[@class='js-price-display']",
        "//h2[contains(@class,'js-price-display')]"
    ]

    IMAGES_XPATHS = [
        "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]/div/a/img",
        "//div[@class='cloud-zoom-wrap']/a",
        "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]/div/a",
        "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]//img",
    ]

    WORDS_XPATHS = [
        "//div[contains(@class,'js-product-left-col')]/div[contains(@class,'product-description')]/p",
        "//div[contains(@class,'product-description')]/p",
        "//div[@class='user-content']//p",
    ]

    SIZES_XPATHS = [
        # "//div[contains(@data-variant,'Talle')]/div/a/span",
        "//form[@id='product_form']//div[contains(@data-variant,'Talle')]/div/a/span",
        "//form[@id='product_form']//label[text()[contains(.,'Talle')]]/following-sibling::select/option",
        "//form[@id='product_form']//label[text()[contains(.,'mero')]]/following-sibling::select/option"
    ]

    COLORS_XPATHS = [
        # "//div[contains(@data-variant,'Color')]/div/a/span",
        # "//form[@id='product_form']//label[text()='Color']/following-sibling::select/option",
        # "//span[text()[contains(.,'Color')]]/parent::label/following-sibling::div/select[contains(@class,'js-variation-option')]/option"
        "//span[text()[contains(.,'Color')]]/parent::label/following-sibling::div/select/option",
        "//form[@id='product_form']//label[text()[contains(.,'Color')]]/following-sibling::select/option",
    ]

    BUY_BUTTON_XPATHS = [
        "//div[contains(@class,'product-buy-container')]/input",
        "//form[@id='product_form']//input[contains(@class,'js-addtocart')]",
    ]

    CATEGORY_XPATHS = [
        "//a[@class='breadcrumb-crumb']",
        "//div[contains(@class,'breadcrumbs')]/a",
    ]

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
    # driver = webdriver.Chrome(options=options)

    driver = webdriver.Chrome(
        executable_path='./chromedriver.exe', options=options)

    # Functions

    def waitForElement(xpath, driver, max_time, multi):
        if multi == True:
            result = WebDriverWait(driver, max_time).until(
                EC.presence_of_all_elements_located((By.XPATH, xpath)))
            return result
        else:
            result = WebDriverWait(driver, max_time).until(
                EC.presence_of_element_located((By.XPATH, xpath)))
            return result

    def map_category(category):
        if category in ['VESTIDOS']:
            return 'Vestidos'
        elif category in ['SHORTS', 'SHORTS Y BERMUDAS', 'Short']:
            return 'Shorts y bermudas'
        elif category in ['FALDAS', 'Pollera']:
            return 'Faldas'
        elif category in ['REMERAS Y TOPS', 'REMERAS', 'Tops', 'Remes', 'Remerones', 'CAMISAS', 'CAMISETAS OVERSIZE']:
            return 'Remeras y tops'
        elif category in ['BODYS', 'Body']:
            return 'Bodys'
        elif category in ['HOODIES/BUZOS', 'BUZOS Y SWEATERS', 'BUZOS', 'Hoodie/Buzos']:
            return 'Hoodies/Buzos/Sweaters'
        elif category in ['PANTALONES', 'Pantalones', 'CALZAS']:
            return 'Pantalones'
        elif category in ['CONJUNTOS']:
            return 'Conjuntos'
        elif category in ['Trajes de Baño']:
            return 'Trajes de baño'
        elif category in ['Chalecos']:
            return 'Chalecos'
        elif category in ['Corset']:
            return 'Corset'
        elif category in ['CALZADO']:
            return 'Calzado'
        elif category in ['Accesorios', 'CHOKERS eco-cuero', 'CHOKERS con cadenita', 'COLLARES', 'AROS', 'ANILLOS', 'PULSERAS DE TACHAS', 'OTROS ACCESORIOS', 'PULSERAS']:
            return 'Accesorios'
        elif category in ['Colección']:
            return 'Colección'
        elif category in ['Sale !']:
            return 'Sale!'
        elif category in ['THE END OF $TW']:
            return 'The end of $TW'
        elif category in ['Mallas y Bermudas']:
            return 'Mallas y bermudas'
        elif category in ['Gorras', 'Beanies']:
            return 'Gorras y Beanies'
        else:
            return category

    # Variables
    scraping_time = time.time()
    error_log_list = []
    colors_list = []
    sizes_list = []
    images_list = []
    description = []

    lucky_product_xpath = 0
    lucky_link_xpath = 0
    lucky_name_xpath = 0
    lucky_price_xpath = 0
    lucky_images_xpath = 0
    lucky_words_xpath = 0
    lucky_category_xpath = 0
    lucky_sizes_xpath = 0
    lucky_colors_xpath = 0
    lucky_buy_button_xpath = 0

    total_name_time = 0
    total_price_time = 0
    total_images_time = 0
    total_words_time = 0
    total_category_time = 0
    total_buy_button_time = 0
    total_sizes_time = 0

    name = None
    price = None
    images = None
    words = None
    category = None
    sizes = None
    buy_button = None
    colors = None
    subCategory = ''

    # Start Scraping
    driver.get(link)
    driver.maximize_window()

    # if password after entering the site, quit
    if 'password' in driver.current_url:
        driver.quit()
        return 'Site in maintenance'

    # Get Name
    try:
        name_time = time.time()
        name = waitForElement(
            NAME_XPATHS[lucky_name_xpath], driver, 0.25, False).text
        name_time = time.time() - name_time
        print('Name found in', name_time,
              'seconds with lucky ;)')
        print('\n Name:', name)
    except:
        for name_xpath in NAME_XPATHS:
            try:
                name_time = time.time()
                name = waitForElement(
                    name_xpath, driver, 0.25, False).text
                name_time = time.time() - name_time
                print('Name found in', name_time, 'seconds')
                print('\n Name:', name)
                lucky_name_xpath = NAME_XPATHS.index(name_xpath)
                break
            except:
                pass
    if name == None:
        error_log_list.append({
            'error at': 'name',
            'link': driver.current_url,
            'time': time.time(),
            'xpath': name_xpath
        })

    # Get Price
    try:
        price_time = time.time()
        price = waitForElement(
            PRICE_XPATHS[lucky_price_xpath], driver, 0.05, False).text
        price_time = time.time() - price_time
        print('Price found in', price_time,
              'seconds with lucky ;)')
    except:
        for price_xpath in PRICE_XPATHS:
            try:
                price_time = time.time()
                price = waitForElement(
                    price_xpath, driver, 0.05, False).text
                price_time = time.time() - price_time
                print('Price found in', price_time, 'seconds')
                lucky_price_xpath = PRICE_XPATHS.index(price_xpath)
                break
            except:
                pass
    if price == None:
        error_log_list.append({
            'error at': 'price',
            'link': driver.current_url,
            'time': time.time(),
            'xpath': price_xpath
        })
    else:
        if price == '' or None:
            price = '0'

        price = price.replace('$', '')
        price = price.replace('.', '')
        price = price.split(',')[0]
        price = float(price)

    # Get Images
    try:
        images_time = time.time()
        images = waitForElement(
            IMAGES_XPATHS[lucky_images_xpath], driver, 0.23, True)
        images_time = time.time() - images_time

        for image in images:
            if image.tag_name == 'a':
                if 'http' and not 'placeholder' in image.get_attribute('href'):
                    images_list.append(image.get_attribute('href'))
                else:
                    raise Exception('Image href is not a link')
            elif image.tag_name == 'img':
                srcset = image.get_attribute('srcset')
                srcset_items = srcset.split(',')
                last_item = srcset_items[-1].strip().split(' ')[0]

                if 'placeholder' not in last_item:
                    images_list.append(last_item)
                else:
                    raise Exception(
                        'Image src or srcset is not a link or contains a placeholder')
            else:
                raise Exception('Image tag name is not a or img')

        print('Images found in', images_time, 'seconds with lucky ;)')
    except:
        for images_xpath in IMAGES_XPATHS:
            try:
                images_time = time.time()
                images = waitForElement(
                    images_xpath, driver, 0.23, True)
                images_time = time.time() - images_time

                for image in images:
                    if image.tag_name == 'a':
                        if 'http' and not 'placeholder' in image.get_attribute('href'):
                            images_list.append(
                                image.get_attribute('href'))
                        else:
                            raise Exception(
                                'Image href is not a link')
                    elif image.tag_name == 'img':
                        srcset = image.get_attribute('srcset')
                        srcset_items = srcset.split(',')
                        last_item = srcset_items[-1].strip().split(' ')[
                            0]

                        if 'placeholder' not in last_item:
                            images_list.append(last_item)
                        else:
                            raise Exception(
                                'Image src or srcset is not a link or contains a placeholder')
                    else:
                        raise Exception(
                            'Image tag name is not a or img')

                print('Images found in', images_time, 'seconds')
                lucky_images_xpath = IMAGES_XPATHS.index(
                    images_xpath)
            except:
                pass
    if images == None:
        error_log_list.append({
            'error at': 'images',
            'link': driver.current_url,
            'time': time.time(),
            'xpath': images_xpath
        })

    # Get Description
    try:
        words_time = time.time()
        words = waitForElement(
            WORDS_XPATHS[lucky_words_xpath], driver, 0.2, True)
        words_time = time.time() - words_time
        print(len(words), 'words found in',
              words_time, 'seconds with lucky ;)')
    except:
        for words_xpath in WORDS_XPATHS:
            try:
                words_time = time.time()
                words = waitForElement(
                    words_xpath, driver, 0.2, True)
                words_time = time.time() - words_time
                print(len(words), 'words found in',
                      words_time, 'seconds')
                lucky_words_xpath = WORDS_XPATHS.index(words_xpath)
                break
            except:
                pass
    if words != None:
        for word in words:
            description.append(word.text)

        description = [word for word in description if word != ' ']

        if 'belforte.com.ar' in driver.current_url:
            description = description[:-4]

        description = ' '.join(description)
        description = description.replace(' -', '\n -')
        description = description.replace('  ', '\n')
        description = description.replace('. ', '\n')

    # Get Category
    try:
        category_time = time.time()
        category = waitForElement(
            CATEGORY_XPATHS[lucky_category_xpath], driver, 0.3, True)
        category_time = time.time() - category_time

        # if category is more than one, iterate ignoring 'inicio' and 'home'
        print(len(category))
        if len(category) > 1:
            print('more than one category')
            for item in category:
                print(item.text)
                if item.text.lower() != 'inicio' and item.text.lower() != 'home':
                    category = item.text
                    category = map_category(category)
                    print('category found ' + category)
                    break
        else:
            category = category[0].text
            category = map_category(category)

        print('Category found in', category_time, 'seconds with lucky ;)')
    except:
        for category_xpath in CATEGORY_XPATHS:
            try:
                category_time = time.time()
                category = waitForElement(
                    category_xpath, driver, 0.3, True)

                # if category is more than one, iterate ignoring 'inicio' and 'home'
                print(len(category))
                if len(category) > 1:
                    print('more than one category')
                    for item in category:
                        print(item.text)
                        if item.text.lower() != 'inicio' and item.text.lower() != 'home':
                            category = item.text
                            category = map_category(category)
                            print('category found ' + category)
                            break

                category_time = time.time() - category_time
                print('Category found in', category_time, 'seconds')
                lucky_category_xpath = CATEGORY_XPATHS.index(
                    category_xpath)
                break
            except:
                pass
    if category == None:
        error_log_list.append({
            'error at': 'category',
            'link': driver.current_url,
            'time': time.time(),
            'xpath': category_xpath
        })

    # Get Buy Button
    try:
        buy_button_time = time.time()
        buy_button = waitForElement(
            BUY_BUTTON_XPATHS[lucky_buy_button_xpath], driver, 0.01, False)
        buy_button_time = time.time() - buy_button_time
        print('Buy button found in', buy_button_time, 'seconds with lucky ;)')
    except:
        for buy_button_xpath in BUY_BUTTON_XPATHS:
            try:
                buy_button_time = time.time()
                buy_button = waitForElement(
                    buy_button_xpath, driver, 0.01, False)
                buy_button_time = time.time() - buy_button_time
                print('Buy button found in',
                      buy_button_time, 'seconds')
                lucky_buy_button_xpath = BUY_BUTTON_XPATHS.index(
                    buy_button_xpath)
                break
            except:
                pass
    if buy_button == None:
        error_log_list.append({
            'error at': 'buy button',
            'link': driver.current_url,
            'time': time.time(),
            'xpath': buy_button_xpath
        })
    else:
        # Get Colors
        colors_list = []
        try:
            colors_time = time.time()
            colors = waitForElement(
                COLORS_XPATHS[lucky_colors_xpath], driver, 0.1, True)
            colors_time = time.time() - colors_time
            print(len(colors), 'colors found in',
                  colors_time, 'seconds with lucky ;)')
        except:
            for colors_xpath in COLORS_XPATHS:
                try:
                    colors_time = time.time()
                    colors = waitForElement(
                        colors_xpath, driver, 0.1, True)
                    colors_time = time.time() - colors_time
                    print(len(colors), 'colors found in',
                          colors_time, 'seconds')
                    lucky_colors_xpath = COLORS_XPATHS.index(
                        colors_xpath)
                    break
                except:
                    pass
        if colors == None:
            # error_log_list.append({
            #     'error at': 'colors',
            #     'link': driver.current_url,
            #     'time': time.time(),
            #     'xpath': colors_xpath
            # })

            # # Get Sizes Without color:unique
            sizes_list = []
            try:
                sizes_time = time.time()
                sizes = waitForElement(
                    SIZES_XPATHS[lucky_sizes_xpath], driver, 0.02, True)
                sizes_time = time.time() - sizes_time
                print(len(sizes), 'sizes found in',
                      sizes_time, 'seconds with lucky ;)')
            except:
                for sizes_xpath in SIZES_XPATHS:
                    try:
                        sizes_time = time.time()
                        sizes = waitForElement(
                            sizes_xpath, driver, 0.02, True)
                        sizes_time = time.time() - sizes_time
                        print(len(sizes), 'sizes found in',
                              sizes_time, 'seconds')
                        lucky_sizes_xpath = SIZES_XPATHS.index(
                            sizes_xpath)
                        break
                    except:
                        pass
            if sizes == None:
                color_obj = {}
                color_obj['color'] = 'Unico'
                size_obj = {}
                size_obj['size'] = 'Unico'
                if buy_button.get_attribute('disabled'):
                    size_obj['stock'] = 0
                else:
                    size_obj['stock'] = 10

                sizes_list.append(size_obj)
                color_obj['sizes'] = [size_obj]

                colors_list.append(color_obj)

            else:
                # if newsletter is present, close it
                try:
                    newsletter = waitForElement(
                        "//div[@class='_dp_close']", driver, 0.01, False)
                    newsletter.click()
                    print('newsletter closed')
                except:
                    pass

                for size in sizes:
                    color_obj = {}
                    color_obj['color'] = 'Unico'
                    size_obj = {}

                    size_obj['size'] = size.text
                    size.click()
                    if buy_button.get_attribute('disabled'):
                        size_obj['stock'] = 0
                    else:
                        size_obj['stock'] = 10
                    sizes_list.append(size_obj)
                    color_obj['sizes'] = sizes_list
                colors_list.append(color_obj)

        else:
            for color in colors:
                color_obj = {}
                try:
                    color_obj['color'] = color.get_attribute(
                        'value').capitalize()
                    is_span = WebDriverWait(driver, 0.1).until(EC.presence_of_element_located(
                        (By.XPATH, "//div[contains(@data-variant,'Color')]/div/a/span[@data-name='" + color.get_attribute("value") + "']")))
                    is_span.click()
                    sleep(1)
                except:
                    color_obj['color'] = color.get_attribute(
                        'value').capitalize()
                    color.click()
                    sleep(1)

                # Get Sizes
                sizes_list = []
                try:
                    sizes_time = time.time()
                    sizes = waitForElement(
                        SIZES_XPATHS[lucky_sizes_xpath], driver, 0.02, True)
                    sizes_time = time.time() - sizes_time
                    print(len(sizes), 'sizes found in',
                          sizes_time, 'seconds with lucky ;)')
                except:
                    for sizes_xpath in SIZES_XPATHS:
                        try:
                            sizes_time = time.time()
                            sizes = waitForElement(
                                sizes_xpath, driver, 0.02, True)
                            sizes_time = time.time() - sizes_time
                            print(len(sizes), 'sizes found in',
                                  sizes_time, 'seconds')
                            lucky_sizes_xpath = SIZES_XPATHS.index(
                                sizes_xpath)
                            break
                        except:
                            pass
                if sizes == None:
                    size_obj = {}
                    size_obj['size'] = 'Unico'
                    if buy_button.get_attribute('disabled'):
                        size_obj['stock'] = 0
                    else:
                        size_obj['stock'] = 10
                    sizes_list.append(size_obj)
                    color_obj['sizes'] = sizes_list
                    colors_list.append(color_obj)
                else:
                    # if newsletter is present, close it
                    try:
                        newsletter = waitForElement(
                            "//div[@class='_dp_close']", driver, 0.01, False)
                        newsletter.click()
                        print('newsletter closed')
                    except:
                        pass

                    for size in sizes:
                        size_obj = {}
                        size_obj['size'] = size.text
                        size.click()
                        if buy_button.get_attribute('disabled'):
                            size_obj['stock'] = 0
                        else:
                            size_obj['stock'] = 10
                        sizes_list.append(size_obj)
                        color_obj['sizes'] = sizes_list
                colors_list.append(color_obj)

    user = User.objects.get(id=1)

    # if name.lower() contains 'remeron' set subcategory to 'Remerones'
    if name:
        if 'remeron' in name.lower():
            subCategory = 'Remerones'

    # if some field except description is none set is_active to False
    status = True
    if not name or not price or not images or not category or not buy_button or price == '0' or price == '':
        status = False

    # if product doesn't exist, create it
    try:
        product = Product.objects.get(original_url=link)
        product.is_active = status
        product.save()
    except:
        product = Product(
            user=user,
            name=name,
            price=price,
            description=description,
            category=category,
            subCategory=subCategory,
            original_url=link,
            is_scraped=True,
            is_active=status,
        )
        product.save()

    # update product price
    # if price is lower than product.price, don't update it
    # if price is higher than product.price, update it
    if price != None and product.price != price:
        if product.price > price:
            pass
        else:
            product.price = price
            product.save()

    # if product had subcategory then don't update category
    # if product.subCategory:
    #     pass
    # else:
    #     # # update product category
    #     if product.category != category:
    #         product.category = category
    #         product.save()

    #     # update product subcategory
    #     if product.subCategory != subCategory:
    #         product.subCategory = subCategory
    #         product.save()

    for image in images_list:
        if image.startswith('//'):
            image = 'https:' + image
        # if image ends with #, remove it from the list
        if image.endswith('#'):
            images_list.remove(image)
            continue

        # if image doesn't exist, create it
        try:
            product_image = ProductImage.objects.get(
                product=product, original_url=image)
            continue
        except:
            try:
                image_content = requests.get(image).content
                image_name = image.split('/')[-1]
                image_file = ContentFile(image_content, image_name)
                img = Image.open(image_file)
                img.verify()

                # the image is valid

                product_image = ProductImage(
                    product=product,
                    image=image_file,
                    original_url=image
                )
                product_image.save()
                print('image saved')
            except Exception as e:
                # the image is invalid
                print('image is invalid')
                pass

    if colors_list == [] or colors_list == None:
        colors_list = [{'color': 'Unico', 'sizes': [
            {'size': 'Unico', 'stock': 10}]}]

    for color in colors_list:
        # if color doesn't exist, create it
        try:
            color_obj = Color.objects.get(color=color['color'])
        except:
            color_obj = Color(
                color=color['color']
            )
            color_obj.save()

        for size in color['sizes']:
            # if size doesn't exist, create it
            try:
                size_obj = Size.objects.get(size=size['size'])
            except:
                size_obj = Size(
                    size=size['size']
                )
                size_obj.save()

            # if product_attribute doesn't exist, create it
            try:
                product_attribute = ProductAttribute.objects.get(
                    product=product, color=color_obj, size=size_obj)
                product_attribute.stock = size['stock']
                product_attribute.save()
                continue
            except:
                product_attribute = ProductAttribute(
                    product=product,
                    stock=size['stock']
                )

                product_attribute.save()
                product_attribute.color.add(color_obj)
                product_attribute.size.add(size_obj)

    print('product saved')
    print(len(error_log_list), 'errors_log found')
    scraping_time = time.time() - scraping_time
    print('Scraping time:', scraping_time, 'seconds')

    driver.quit()
    return None

# go to products page and scrape all products that are not scraped


@shared_task(track_started=True)
def scrape_discover():
    PRODUCTS_XPATHS = [
        "//div[contains(@data-component,'product-list-item')]",
        "//div[contains(@class,'item-description')]",
        "//div[@class='product-row row']/div",
    ]

    LINK_XPATHS = [
        ".//a",
    ]

    NAME_XPATHS = [
        "//h1",
    ]

    PRICE_XPATHS = [
        "//span[@id='price_display']",
        "//h3[@id='price_display']",
        "//div[@class='js-price-display']",
        "//h2[contains(@class,'js-price-display')]"
    ]

    IMAGES_XPATHS = [
        "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]/div/a/img",
        "//div[@class='cloud-zoom-wrap']/a",
        "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]/div/a",
        "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]//img",
    ]

    WORDS_XPATHS = [
        "//div[contains(@class,'js-product-left-col')]/div[contains(@class,'product-description')]/p",
        "//div[contains(@class,'product-description')]/p",
        "//div[@class='user-content']//p",
    ]

    SIZES_XPATHS = [
        # "//div[contains(@data-variant,'Talle')]/div/a/span",
        "//form[@id='product_form']//div[contains(@data-variant,'Talle')]/div/a/span",
        "//form[@id='product_form']//label[text()[contains(.,'Talle')]]/following-sibling::select/option",
        "//form[@id='product_form']//label[text()[contains(.,'mero')]]/following-sibling::select/option"
    ]

    COLORS_XPATHS = [
        # "//div[contains(@data-variant,'Color')]/div/a/span",
        # "//form[@id='product_form']//label[text()='Color']/following-sibling::select/option",
        # "//span[text()[contains(.,'Color')]]/parent::label/following-sibling::div/select[contains(@class,'js-variation-option')]/option"
        "//span[text()[contains(.,'Color')]]/parent::label/following-sibling::div/select/option",
        "//form[@id='product_form']//label[text()[contains(.,'Color')]]/following-sibling::select/option",
    ]

    BUY_BUTTON_XPATHS = [
        "//div[contains(@class,'product-buy-container')]/input",
        "//form[@id='product_form']//input[contains(@class,'js-addtocart')]",
    ]

    CATEGORY_XPATHS = [
        "//a[@class='breadcrumb-crumb']",
        "//div[contains(@class,'breadcrumbs')]/a",
    ]

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
    # driver = webdriver.Chrome(options=options)

    driver = webdriver.Chrome(
        executable_path='./chromedriver.exe', options=options)

    # Functions

    def map_category(category):
        if category in ['VESTIDOS']:
            return 'Vestidos'
        elif category in ['SHORTS', 'SHORTS Y BERMUDAS', 'Short']:
            return 'Shorts y bermudas'
        elif category in ['FALDAS', 'Pollera']:
            return 'Faldas'
        elif category in ['REMERAS Y TOPS', 'REMERAS', 'Tops', 'Remes', 'Remerones', 'CAMISAS', 'CAMISETAS OVERSIZE']:
            return 'Remeras y tops'
        elif category in ['BODYS', 'Body']:
            return 'Bodys'
        elif category in ['HOODIES/BUZOS', 'BUZOS Y SWEATERS', 'BUZOS', 'Hoodie/Buzos']:
            return 'Hoodies/Buzos/Sweaters'
        elif category in ['PANTALONES', 'Pantalones', 'CALZAS']:
            return 'Pantalones'
        elif category in ['CONJUNTOS']:
            return 'Conjuntos'
        elif category in ['Trajes de Baño']:
            return 'Trajes de baño'
        elif category in ['Chalecos']:
            return 'Chalecos'
        elif category in ['Corset']:
            return 'Corset'
        elif category in ['CALZADO']:
            return 'Calzado'
        elif category in ['Accesorios', 'CHOKERS eco-cuero', 'CHOKERS con cadenita', 'COLLARES', 'AROS', 'ANILLOS', 'PULSERAS DE TACHAS', 'OTROS ACCESORIOS', 'PULSERAS']:
            return 'Accesorios'
        elif category in ['Colección']:
            return 'Colección'
        elif category in ['Sale !']:
            return 'Sale!'
        elif category in ['THE END OF $TW']:
            return 'The end of $TW'
        elif category in ['Mallas y Bermudas']:
            return 'Mallas y bermudas'
        elif category in ['Gorras', 'Beanies']:
            return 'Gorras y Beanies'
        else:
            return category

    stores = [
        "https://www.satanaclothes.com/productos/?mpage=60",
        "https://www.mustaqe.com.ar/productos/?mpage=60",
        "https://www.jimmyrebel.com.ar/productos/?mpage=60",
    ]

    was_saved = False

    for store in stores:
        def waitForElement(xpath, driver, max_time, multi):
            if multi == True:
                result = WebDriverWait(driver, max_time).until(
                    EC.presence_of_all_elements_located((By.XPATH, xpath)))
                return result
            else:
                result = WebDriverWait(driver, max_time).until(
                    EC.presence_of_element_located((By.XPATH, xpath)))
                return result

        driver.get(store)
        driver.maximize_window()

        error_log_list = []
        products_list = []
        colors_list = []
        sizes_list = []

        lucky_product_xpath = 0
        lucky_link_xpath = 0
        lucky_name_xpath = 0
        lucky_price_xpath = 0
        lucky_images_xpath = 0
        lucky_words_xpath = 0
        lucky_category_xpath = 0
        lucky_sizes_xpath = 0
        lucky_colors_xpath = 0
        lucky_buy_button_xpath = 0

        products = []
        links = []

        total_name_time = 0
        total_price_time = 0
        total_images_time = 0
        total_words_time = 0
        total_category_time = 0
        total_buy_button_time = 0
        total_sizes_time = 0

        # Get Products

        # press END button to go to the end of the page
        print('pressing END button')
        body = driver.find_element(By.TAG_NAME, 'body')
        body.send_keys(Keys.END)

        # WAIT 2 SECONDS
        time.sleep(2)
        print('pressing HOME button')
        body.send_keys(Keys.HOME)

        try:
            products_time = time.time()
            products = waitForElement(
                PRODUCTS_XPATHS[lucky_product_xpath], driver, 0.2, True)
            products_time = time.time() - products_time
            # press HOME button to go to the top of the page
            print(len(products), 'products found in',
                  products_time, 'seconds with lucky ;)')

        except:
            for product_xpath in PRODUCTS_XPATHS:
                try:
                    products_time = time.time()
                    products = waitForElement(product_xpath, driver, 0.2, True)
                    products_time = time.time() - products_time
                    print(len(products), 'products found in',
                          products_time, 'seconds')
                    lucky_product_xpath = PRODUCTS_XPATHS.index(product_xpath)
                    break
                except:
                    pass

        if len(products) <= 0:
            # go to next store
            continue

        else:

            scraping_time = time.time()

            for product in products:
                # for i in range(0, 1):
                #     product = products[i]
                try:
                    link_time = time.time()
                    link = waitForElement(
                        LINK_XPATHS[lucky_link_xpath], product, 0.03, False).get_attribute('href')
                    link_time = time.time() - link_time
                    if 'tabla-de-talles' not in link:
                        print('Link found in', link_time,
                              'seconds with lucky ;)')
                        links.append(link)
                except:
                    for link_xpath in LINK_XPATHS:
                        try:
                            link_time = time.time()
                            link = waitForElement(
                                link_xpath, product, 0.05, False).get_attribute('href')
                            link_time = time.time() - link_time
                            if 'tabla-de-talles' not in link:
                                print('Link found in', link_time, 'seconds')
                                links.append(link)
                                lucky_link_xpath = LINK_XPATHS.index(
                                    link_xpath)
                                break
                        except:
                            pass

                if len(links) == 0:
                    print('No link found')
                    driver.quit()
                    exit()

            # every product has a original_url
            # if links contains the same link, remove it
            existing_links = set(
                Product.objects.values_list('original_url', flat=True))
            new_links = set(links) - existing_links

            for link in new_links:
                driver.get(link)
                driver.maximize_window()

                name = None
                price = None
                images = None
                words = None
                category = None
                sizes = None
                buy_button = None
                colors = None

                # Get Name
                try:
                    name_time = time.time()
                    name = waitForElement(
                        NAME_XPATHS[lucky_name_xpath], driver, 0.25, False).text
                    name_time = time.time() - name_time
                    print('Name found in', name_time,
                          'seconds with lucky ;)')
                    print('\n Name:', name)

                except:
                    for name_xpath in NAME_XPATHS:
                        try:
                            name_time = time.time()
                            name = waitForElement(
                                name_xpath, driver, 0.25, False).text
                            name_time = time.time() - name_time
                            print('Name found in', name_time, 'seconds')
                            print('\n Name:', name)
                            lucky_name_xpath = NAME_XPATHS.index(name_xpath)
                            break
                        except:
                            pass
                if name == None:
                    error_log_list.append({
                        'error at': 'name',
                        'link': driver.current_url,
                        'time': time.time(),
                        'xpath': name_xpath
                    })

                # Get Price
                try:
                    price_time = time.time()
                    price = waitForElement(
                        PRICE_XPATHS[lucky_price_xpath], driver, 0.05, False).text
                    price_time = time.time() - price_time
                    print('Price found in', price_time,
                          'seconds with lucky ;)')
                except:
                    for price_xpath in PRICE_XPATHS:
                        try:
                            price_time = time.time()
                            price = waitForElement(
                                price_xpath, driver, 0.05, False).text
                            price_time = time.time() - price_time
                            print('Price found in', price_time, 'seconds')
                            lucky_price_xpath = PRICE_XPATHS.index(price_xpath)
                            break
                        except:
                            pass
                if price == None:
                    error_log_list.append({
                        'error at': 'price',
                        'link': driver.current_url,
                        'time': time.time(),
                        'xpath': price_xpath
                    })

                else:
                    if price == '' or None:
                        price = '0'

                    price = price.replace('$', '')
                    price = price.replace('.', '')
                    price = price.split(',')[0]
                    price = float(price)

                # Get Images
                images_list = []
                try:
                    images_time = time.time()
                    images = waitForElement(
                        IMAGES_XPATHS[lucky_images_xpath], driver, 0.23, True)
                    images_time = time.time() - images_time

                    for image in images:
                        if image.tag_name == 'a':
                            if 'http' and not 'placeholder' in image.get_attribute('href'):
                                images_list.append(image.get_attribute('href'))
                            else:
                                raise Exception('Image href is not a link')
                        elif image.tag_name == 'img':
                            srcset = image.get_attribute('srcset')
                            srcset_items = srcset.split(',')
                            last_item = srcset_items[-1].strip().split(' ')[0]

                            if 'placeholder' not in last_item:
                                images_list.append(last_item)
                            else:
                                raise Exception(
                                    'Image src or srcset is not a link or contains a placeholder')
                        else:
                            raise Exception('Image tag name is not a or img')

                    print('Images found in', images_time,
                          'seconds with lucky ;)')

                except:
                    for images_xpath in IMAGES_XPATHS:
                        try:
                            images_time = time.time()
                            images = waitForElement(
                                images_xpath, driver, 0.23, True)
                            images_time = time.time() - images_time

                            for image in images:
                                if image.tag_name == 'a':
                                    if 'http' and not 'placeholder' in image.get_attribute('href'):
                                        images_list.append(
                                            image.get_attribute('href'))
                                    else:
                                        raise Exception(
                                            'Image href is not a link')
                                elif image.tag_name == 'img':
                                    srcset = image.get_attribute('srcset')
                                    srcset_items = srcset.split(',')
                                    last_item = srcset_items[-1].strip().split(' ')[
                                        0]

                                    if 'placeholder' not in last_item:
                                        images_list.append(last_item)
                                    else:
                                        raise Exception(
                                            'Image src or srcset is not a link or contains a placeholder')
                                else:
                                    raise Exception(
                                        'Image tag name is not a or img')

                            print('Images found in', images_time, 'seconds')
                            lucky_images_xpath = IMAGES_XPATHS.index(
                                images_xpath)
                        except:
                            pass
                if images == None:
                    error_log_list.append({
                        'error at': 'images',
                        'link': driver.current_url,
                        'time': time.time(),
                        'xpath': images_xpath
                    })

                # Get Description
                description = []
                try:
                    words_time = time.time()
                    words = waitForElement(
                        WORDS_XPATHS[lucky_words_xpath], driver, 0.2, True)
                    words_time = time.time() - words_time
                    print(len(words), 'words found in',
                          words_time, 'seconds with lucky ;)')
                except:
                    for words_xpath in WORDS_XPATHS:
                        try:
                            words_time = time.time()
                            words = waitForElement(
                                words_xpath, driver, 0.2, True)
                            words_time = time.time() - words_time
                            print(len(words), 'words found in',
                                  words_time, 'seconds')
                            lucky_words_xpath = WORDS_XPATHS.index(words_xpath)
                            break
                        except:
                            pass

                if words != None:
                    for word in words:
                        description.append(word.text)

                    description = [word for word in description if word != ' ']

                    if 'belforte.com.ar' in driver.current_url:
                        description = description[:-4]

                    description = ' '.join(description)
                    description = description.replace(' -', '\n -')
                    description = description.replace('  ', '\n')
                    description = description.replace('. ', '\n')

                # Get Category
                try:
                    category_time = time.time()
                    category = waitForElement(
                        CATEGORY_XPATHS[lucky_category_xpath], driver, 0.3, True)
                    category_time = time.time() - category_time

                    # if category is more than one, iterate ignoring 'inicio' and 'home'
                    print(len(category))
                    if len(category) > 1:
                        print('more than one category')
                        for item in category:
                            print(item.text)
                            if item.text.lower() != 'inicio' and item.text.lower() != 'home':
                                category = item.text
                                category = map_category(category)
                                print('category found ' + category)
                                break
                    else:
                        category = category[0].text
                        category = map_category(category)

                    print('Category found in', category_time,
                          'seconds with lucky ;)')
                except:
                    for category_xpath in CATEGORY_XPATHS:
                        try:
                            category_time = time.time()
                            category = waitForElement(
                                category_xpath, driver, 0.3, True)

                            # if category is more than one, iterate ignoring 'inicio' and 'home'
                            print(len(category))
                            if len(category) > 1:
                                print('more than one category')
                                for item in category:
                                    print(item.text)
                                    if item.text.lower() != 'inicio' and item.text.lower() != 'home':
                                        category = item.text
                                        category = map_category(category)
                                        print('category found ' + category)
                                        break

                            category_time = time.time() - category_time
                            print('Category found in',
                                  category_time, 'seconds')
                            lucky_category_xpath = CATEGORY_XPATHS.index(
                                category_xpath)
                            break
                        except:
                            pass
                if category == None:
                    error_log_list.append({
                        'error at': 'category',
                        'link': driver.current_url,
                        'time': time.time(),
                        'xpath': category_xpath
                    })

                # Get Buy Button
                try:
                    buy_button_time = time.time()
                    buy_button = waitForElement(
                        BUY_BUTTON_XPATHS[lucky_buy_button_xpath], driver, 0.01, False)
                    buy_button_time = time.time() - buy_button_time
                    print('Buy button found in', buy_button_time,
                          'seconds with lucky ;)')
                except:
                    for buy_button_xpath in BUY_BUTTON_XPATHS:
                        try:
                            buy_button_time = time.time()
                            buy_button = waitForElement(
                                buy_button_xpath, driver, 0.01, False)
                            buy_button_time = time.time() - buy_button_time
                            print('Buy button found in',
                                  buy_button_time, 'seconds')
                            lucky_buy_button_xpath = BUY_BUTTON_XPATHS.index(
                                buy_button_xpath)
                            break
                        except:
                            pass
                if buy_button == None:
                    error_log_list.append({
                        'error at': 'buy button',
                        'link': driver.current_url,
                        'time': time.time(),
                        'xpath': buy_button_xpath
                    })

                else:
                    # Get Colors
                    colors_list = []
                    try:
                        colors_time = time.time()
                        colors = waitForElement(
                            COLORS_XPATHS[lucky_colors_xpath], driver, 0.1, True)
                        colors_time = time.time() - colors_time
                        print(len(colors), 'colors found in',
                              colors_time, 'seconds with lucky ;)')
                    except:
                        for colors_xpath in COLORS_XPATHS:
                            try:
                                colors_time = time.time()
                                colors = waitForElement(
                                    colors_xpath, driver, 0.1, True)
                                colors_time = time.time() - colors_time
                                print(len(colors), 'colors found in',
                                      colors_time, 'seconds')
                                lucky_colors_xpath = COLORS_XPATHS.index(
                                    colors_xpath)
                                break
                            except:
                                pass
                    if colors == None:
                        # error_log_list.append({
                        #     'error at': 'colors',
                        #     'link': driver.current_url,
                        #     'time': time.time(),
                        #     'xpath': colors_xpath
                        # })

                        # # Get Sizes Without color:unique
                        sizes_list = []
                        try:
                            sizes_time = time.time()
                            sizes = waitForElement(
                                SIZES_XPATHS[lucky_sizes_xpath], driver, 0.02, True)
                            sizes_time = time.time() - sizes_time
                            print(len(sizes), 'sizes found in',
                                  sizes_time, 'seconds with lucky ;)')
                        except:
                            for sizes_xpath in SIZES_XPATHS:
                                try:
                                    sizes_time = time.time()
                                    sizes = waitForElement(
                                        sizes_xpath, driver, 0.02, True)
                                    sizes_time = time.time() - sizes_time
                                    print(len(sizes), 'sizes found in',
                                          sizes_time, 'seconds')
                                    lucky_sizes_xpath = SIZES_XPATHS.index(
                                        sizes_xpath)
                                    break
                                except:
                                    pass
                        if sizes == None:
                            color_obj = {}
                            color_obj['color'] = 'Unico'
                            size_obj = {}
                            size_obj['size'] = 'Unico'
                            if buy_button.get_attribute('disabled'):
                                size_obj['stock'] = 0
                            else:
                                size_obj['stock'] = 10

                            sizes_list.append(size_obj)
                            color_obj['sizes'] = [size_obj]

                            colors_list.append(color_obj)

                        else:
                            # if newsletter is present, close it
                            try:
                                newsletter = waitForElement(
                                    "//div[@class='_dp_close']", driver, 0.01, False)
                                newsletter.click()
                                print('newsletter closed')
                            except:
                                pass

                            for size in sizes:
                                color_obj = {}
                                color_obj['color'] = 'Unico'
                                size_obj = {}

                                size_obj['size'] = size.text
                                size.click()
                                if buy_button.get_attribute('disabled'):
                                    size_obj['stock'] = 0
                                else:
                                    size_obj['stock'] = 10
                                sizes_list.append(size_obj)
                                color_obj['sizes'] = sizes_list
                            colors_list.append(color_obj)

                    else:
                        for color in colors:
                            color_obj = {}
                            try:
                                color_obj['color'] = color.get_attribute(
                                    'value').capitalize()
                                is_span = WebDriverWait(driver, 0.1).until(EC.presence_of_element_located(
                                    (By.XPATH, "//div[contains(@data-variant,'Color')]/div/a/span[@data-name='" + color.get_attribute("value") + "']")))
                                is_span.click()
                                sleep(1)
                            except:
                                color_obj['color'] = color.get_attribute(
                                    'value').capitalize()
                                color.click()
                                sleep(1)

                            # Get Sizes
                            sizes_list = []
                            try:
                                sizes_time = time.time()
                                sizes = waitForElement(
                                    SIZES_XPATHS[lucky_sizes_xpath], driver, 0.02, True)
                                sizes_time = time.time() - sizes_time
                                print(len(sizes), 'sizes found in',
                                      sizes_time, 'seconds with lucky ;)')
                            except:
                                for sizes_xpath in SIZES_XPATHS:
                                    try:
                                        sizes_time = time.time()
                                        sizes = waitForElement(
                                            sizes_xpath, driver, 0.02, True)
                                        sizes_time = time.time() - sizes_time
                                        print(len(sizes), 'sizes found in',
                                              sizes_time, 'seconds')
                                        lucky_sizes_xpath = SIZES_XPATHS.index(
                                            sizes_xpath)
                                        break
                                    except:
                                        pass
                            if sizes == None:
                                size_obj = {}
                                size_obj['size'] = 'Unico'
                                if buy_button.get_attribute('disabled'):
                                    size_obj['stock'] = 0
                                else:
                                    size_obj['stock'] = 10
                                sizes_list.append(size_obj)
                                color_obj['sizes'] = sizes_list
                                colors_list.append(color_obj)
                            else:
                                # if newsletter is present, close it
                                try:
                                    newsletter = waitForElement(
                                        "//div[@class='_dp_close']", driver, 0.01, False)
                                    newsletter.click()
                                    print('newsletter closed')
                                except:
                                    pass

                                for size in sizes:
                                    size_obj = {}
                                    size_obj['size'] = size.text
                                    size.click()
                                    if buy_button.get_attribute('disabled'):
                                        size_obj['stock'] = 0
                                    else:
                                        size_obj['stock'] = 10
                                    sizes_list.append(size_obj)
                                    color_obj['sizes'] = sizes_list
                            colors_list.append(color_obj)

                user = User.objects.get(id=1)

                subCategory = ''
                if name:
                    # if name.lower() contains 'remeron' set subcategory to 'Remerones'
                    if 'remeron' in name.lower():
                        subCategory = 'Remerones'

                # if some field except description is none set is_active to False
                status = True
                if not name or not price or not images or not category or not buy_button:
                    status = False

                # if product doesn't exist, create it
                try:
                    product = Product.objects.get(original_url=link)
                    product.is_active = status
                    product.save()
                except:
                    product = Product(
                        user=user,
                        name=name,
                        price=price,
                        description=description,
                        category=category,
                        subCategory=subCategory,
                        original_url=link,
                        is_scraped=True,
                        is_active=status,
                    )

                    product.save()

                # update product price
                if product.price != price:
                    product.price = price
                    product.save()

                # if product had subcategory then don't update category
                if product.subCategory:
                    pass
                else:
                    # # update product category
                    if product.category != category:
                        product.category = category
                        product.save()

                    # update product subcategory
                    if product.subCategory != subCategory:
                        product.subCategory = subCategory
                        product.save()

                for image in images_list:
                    if image.startswith('//'):
                        image = 'https:' + image
                    # if image ends with #, remove it from the list
                    if image.endswith('#'):
                        images_list.remove(image)
                        continue

                    # if image doesn't exist, create it
                    try:
                        product_image = ProductImage.objects.get(
                            product=product, original_url=image)
                        continue
                    except:
                        try:
                            image_content = requests.get(image).content
                            image_name = image.split('/')[-1]
                            image_file = ContentFile(image_content, image_name)
                            img = Image.open(image_file)
                            img.verify()

                            # the image is valid

                            product_image = ProductImage(
                                product=product,
                                image=image_file,
                                original_url=image
                            )
                            product_image.save()
                            print('image saved')
                        except Exception as e:
                            # the image is invalid
                            print('image is invalid')
                            pass

                if colors_list == [] or colors_list == None:
                    colors_list = [{'color': 'Unico', 'sizes': [
                        {'size': 'Unico', 'stock': 10}]}]

                for color in colors_list:
                    # if color doesn't exist, create it
                    try:
                        color_obj = Color.objects.get(color=color['color'])
                    except:
                        color_obj = Color(
                            color=color['color']
                        )
                        color_obj.save()

                    for size in color['sizes']:
                        # if size doesn't exist, create it
                        try:
                            size_obj = Size.objects.get(size=size['size'])
                        except:
                            size_obj = Size(
                                size=size['size']
                            )
                            size_obj.save()

                        # if product_attribute doesn't exist, create it
                        try:
                            product_attribute = ProductAttribute.objects.get(
                                product=product, color=color_obj, size=size_obj)
                            product_attribute.stock = size['stock']
                            product_attribute.save()
                            continue
                        except:
                            product_attribute = ProductAttribute(
                                product=product,
                                stock=size['stock']
                            )

                            product_attribute.save()
                            product_attribute.color.add(color_obj)
                            product_attribute.size.add(size_obj)

                print('product saved')

            print(len(error_log_list), 'errors_log found')

            scraping_time = time.time() - scraping_time
            print('Scraping time:', scraping_time, 'seconds, average time per product:',
                  scraping_time / len(products), 'seconds, (', len(products), 'products )')

    driver.quit()

    print('---------------------------------------------- \n')
    print('POST SCRAPING PROCESSING')
    print('---------------------------------------------- \n')

    #Priority 1: update products with no images and are active
    products = Product.objects.filter(is_active=True, productimage__isnull=True).annotate(num_views_last_week=Count(
        'productview', filter=Q(productview__viewed_at__gte=timezone.now() - timedelta(days=7)))).order_by('-num_views_last_week')[:100]

    for product in products:
        print('updating product:', product.id, product.name)
        scrape_product(product.id)

    return None
# update all products

@shared_task(track_started=True)
def update_all_products():
    #     update by scraping again using scrape_product function every day at 2:00 AM

    #     Priority 1: update products with no images and are active
    products_prior_1 = Product.objects.filter(is_active=True, productimage__isnull=True).annotate(num_views_last_week=Count(
        'productview', filter=Q(productview__viewed_at__gte=timezone.now() - timedelta(days=7)))).order_by('-num_views_last_week')[:100]


#     Priority 2: update products with more views in the last 7 days (model has the last_week function for that) and the updatedAt is older than 7 days, also the product must be active
    # products_prior_2 = Product.objects.filter(is_active=True, updatedAt__lt=timezone.now(
    # ) - timedelta(days=7)).order_by('-last_week')[:100]
    products_prior_2 = Product.objects.filter(is_active=True, updatedAt__lt=timezone.now() - timedelta(days=7)).annotate(num_views_last_week=Count(
        'productview', filter=Q(productview__viewed_at__gte=timezone.now() - timedelta(days=7)))).order_by('-num_views_last_week')[:100]


#     Priority 3: update products that are in most carts in the last 7 days (model has the last_week function for that) and the updatedAt is older than 7 days, also the product must be active
#     CartItem has Product as a foreign key, so you can use the product__last_week function
    products_prior_3 = Product.objects.filter(
        is_active=True,
        updatedAt__lt=timezone.now() - timedelta(days=7),
        cartitem__createdAt__gte=timezone.now() - timedelta(days=7)
    ).annotate(
        num_cart_items=Sum('cartitem__qty')
    ).order_by('-num_cart_items')[:100]


# #     Priority 4: update products that are in most wishlists in the last 7 days (model has the last_week function for that) and the updatedAt is older than 7 days, also the product must be active
# #     WishlistItem has Product as a foreign key, so you can use the product__last_week function
    products_prior_4 = Product.objects.filter(
        is_active=True, 
        updatedAt__lt=timezone.now() - timedelta(days=7),
        wishlistitem__addedAt__gte=timezone.now() - timedelta(days=7)
    ).annotate(num_wishlists_last_week=Count(
        'wishlistitem',
        filter=Q(wishlistitem__addedAt__gte=timezone.now() - timedelta(days=7)))
    ).order_by('-num_wishlists_last_week')[:100]

# # #     if the 4 priorities exceed 8:00 AM, stop updating products

# # #     if the 4 priorities don't exceed 8:00 AM

# #     Priority 5: update products with updatedAt older than 7 days and are active
    products_prior_5 = Product.objects.filter(is_active=True, updatedAt__lt=timezone.now() - timedelta(days=7)).order_by('-updatedAt')[:100]

# # #     Priority 6: if the 4 priorities don't exceed 8:00 AM keep updating products till 8:00 AM
    products_prior_6 = Product.objects.filter(is_active=True, updatedAt__lt=timezone.now() - timedelta(days=7)).exclude(id__in=products_prior_1).exclude(id__in=products_prior_2).exclude(id__in=products_prior_3).exclude(id__in=products_prior_4).exclude(id__in=products_prior_5)[:400]

    print('products to be updated:',
            'prior 1:', len(products_prior_1),
            'prior 2:', len(products_prior_2),
            'prior 3:', len(products_prior_3),
            'prior 4:', len(products_prior_4),
            'prior 5:', len(products_prior_5),
            'prior 6:', len(products_prior_6),
            )
    
    products = list(chain(products_prior_1, products_prior_2, products_prior_3, products_prior_4, products_prior_5, products_prior_6))

    START_TIME = time.time()

    send_mail(
        'Updating products',
        'Updating products, products to be updated: \n prior 1: {} \n prior 2: {} \n prior 3: {} \n prior 4: {} \n prior 5: {} \n prior 6: {} \n'.format(
            len(products_prior_1), len(products_prior_2), len(products_prior_3), len(products_prior_4), len(products_prior_5), len(products_prior_6)),
        settings.EMAIL_HOST_USER,
        ['estebanhirzfeld@gmail.com'],  # this can be a list of email addresses
        fail_silently=False,
    )

    for product in products:
        print('updating product:', product.id, product.name)
        scrape_product(product.id)

    END_TIME = time.time()

    send_mail(
        'Products updated',
        'Products updated, products updated: \n prior 1: {} \n prior 2: {} \n prior 3: {} \n prior 4: {} \n prior 5: {} \n prior 6: {} \n'.format(
            len(products_prior_1), len(products_prior_2), len(products_prior_3), len(products_prior_4), len(products_prior_5), len(products_prior_6)) + 'Time elapsed: {}'.format(END_TIME - START_TIME),
        settings.EMAIL_HOST_USER,
        ['estebanhirzfeld@gmail.com'],  # this can be a list of email addresses
        fail_silently=False,
    )

    return None


@shared_task
def send_product_notification_email(user_email, product_name, product_size, product_color, product_id):
    send_mail(
        'El producto está disponible',
        'El producto {} en talla {} y color {} ya está disponible para comprar. \n Link: http://localhost:5173/product/{}/ '.format(
            product_name, product_size, product_color, product_id),
        'from@example.com',
        [user_email],
        fail_silently=False,
    )
