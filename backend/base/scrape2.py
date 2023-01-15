from base.models import Product, ProductImage, Review, Order, OrderItem, Size
from django.contrib.auth.models import User

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


# def multiScraper(pages):

#     # -----------------------------------------------------------------------------------------

#     # per every failed element, create an error log dict with the link, the error, time and screenshot of the error
#     # if at least one error log is in the list, try again and set attempt to attempt + 1
#     # if attempt is 3, pass and continue with the next product
#     # if no errors, continue with the next product

#     # if error_log_list == max_attempts, change XPATH_ACTIVE and try again, set attempt to 0

#     XPATHS_LIST = [
#         {
#             'A': {
#                 'products': "//div[contains(@data-component,'product-list-item')]",
#                 'link': ".//a",
#                 'name': "//h1",
#                 'price': "//span[@id='price_display']",
#                 'images': "//div[@class='cloud-zoom-wrap']/a",
#                 'words': "//div[contains(@class,'js-product-left-col')]/div[contains(@class,'product-description')]/p",
#                 'sizes': "//div[contains(@data-variant,'Talle')]/div/a",
#                 'buy_button': "//div[contains(@class,'product-buy-container')]/input",
#                 # 'colors': "//div[contains(@class,'product-variants')]/div[contains(@class,'product-variant')]/div[contains(@class,'product-variant-option')]/a",
#                 'category': "//a[@class='breadcrumb-crumb']",
#             },
#             'B': {
#                 'products': "//div[contains(@class,'item-description')]",
#                 'link': ".//a",
#                 'name': "//h1",
#                 'price': "//h3[@id='price_display']",
#                 'images': "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]/div/a",
#                 'words': "//div[contains(@class,'product-description')]/p",
#                 'sizes': "//form[@id='product_form']//label[text()='Talle']/following-sibling::select/option",
#                 'buy_button': "//form[@id='product_form']//input[contains(@class,'js-addtocart')]",
#                 'category': "//div[contains(@class,'breadcrumbs')]/a",
#             }
#         }
#     ]


# # tiendafuego words:
# # //div[contains(@class,'product-description')]/p[1]

# # Belfort words:
# #   //div[contains(@class,'product-description')]/p[total words - 5]


# # tiendafuego sizes
# # //form[@id='product_form']//label[text()='Talle']/following-sibling::select/option

# # Belfort sizes
# # //form[@id='product_form']//label[text()='número']/following-sibling::select/option

#     user = User.objects.get(id=1)

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
#     driver = webdriver.Chrome(
#         executable_path="chromedriver.exe", options=options)

#     # driver.get('https://www.satanaclothes.com/productos/?mpage=1')
#     driver.get('https://elclubdelsweater.com/verano/chalecos/')
#     driver.maximize_window()

#     products_links = []
#     products_data = []
#     scrolls_counter = 0

#     attempt = 0
#     max_attempts = 2
#     error_log_list = []
#     OPTION = 'A'

#     # product-item
#     try:
#         # if products with xpath A are found, use xpath A, else use xpath B
#         if OPTION == 'A':
#             products = WebDriverWait(driver, 10).until(
#                 EC.presence_of_all_elements_located(
#                     (By.XPATH, XPATHS_LIST[0]['A']['products']))
#             )
#             OPTION = 'A'
#         else:
#             products = WebDriverWait(driver, 10).until(
#                 EC.presence_of_all_elements_located(
#                     (By.XPATH, XPATHS_LIST[0]['B']['products']))
#             )
#             OPTION = 'B'

#     except:
#         print('No products found')
#         error_log_list.append({
#             'error at': 'products',
#             'link': driver.current_url,
#             'time': time.time(),
#             'screenshot': driver.get_screenshot_as_png()
#         })
#         driver.quit()

#     for product in products:

#         try:
#             # if products with xpath A are found, still use xpath A, else use xpath B
#             if OPTION == 'A':
#                 link = WebDriverWait(product, 10).until(
#                     EC.presence_of_element_located(
#                         (By.XPATH, XPATHS_LIST[0]['A']['link']))
#                 ).get_attribute('href')
#                 OPTION = 'A'
#             else:
#                 link = WebDriverWait(product, 10).until(
#                     EC.presence_of_element_located(
#                         (By.XPATH, XPATHS_LIST[0]['B']['link']))
#                 ).get_attribute('href')
#                 OPTION = 'B'

#         except:
#             error_log_list.append({
#                 'error at': 'link',
#                 'link': driver.current_url,
#                 'time': time.time(),
#                 'screenshot': driver.get_screenshot_as_png()
#             })

#     for link in products_links:

#         driver.get(link)

#         scrolls_counter = 0
#         while scrolls_counter < 1:
#             scrolls_counter += 1
#             driver.find_element(
#                 By.XPATH, '//body').send_keys(Keys.CONTROL+Keys.END)
#             print("scrolled down")

#             driver.find_element(
#                 By.XPATH, '//body').send_keys(Keys.CONTROL+Keys.HOME)
#             sleep(random.uniform(2, 3))
#             print("scrolled up")

#         print('Link: ', link)

#         # get product name
#         try:
#             if OPTION == 'A':
#                 name = WebDriverWait(driver, 10).until(
#                     EC.presence_of_element_located(
#                         (By.XPATH, XPATHS_LIST[0]['A']['name']))
#                 ).text
#                 OPTION = 'A'
#             else:
#                 name = WebDriverWait(driver, 10).until(
#                     EC.presence_of_element_located(
#                         (By.XPATH, XPATHS_LIST[0]['B']['name']))
#                 ).text
#                 OPTION = 'B'

#         except:
#             error_log_list.append({
#                 'error at': 'name',
#                 'link': driver.current_url,
#                 'time': time.time(),
#                 'screenshot': driver.get_screenshot_as_png()
#             })

#         # get product price
#         try:
#             if OPTION == 'A':
#                 price = WebDriverWait(driver, 10).until(
#                     EC.presence_of_element_located(
#                         (By.XPATH, XPATHS_LIST[0]['A']['price']))
#                 ).text
#                 OPTION = 'A'
#             else:
#                 price = WebDriverWait(driver, 10).until(
#                     EC.presence_of_element_located(
#                         (By.XPATH, XPATHS_LIST[0]['B']['price']))
#                 ).text
#                 OPTION = 'B'

#             if price:
#                 # remove the $ sign
#                 price = price[1:]
#                 # remove dots
#                 price = price.replace('.', '')
#                 # string to decimal number
#                 price = Decimal(price)

#                 print('Price: ', price)
#         except:
#             error_log_list.append({
#                 'error at': 'price',
#                 'link': driver.current_url,
#                 'time': time.time(),
#                 'screenshot': driver.get_screenshot_as_png()
#             })

#         # get product images
#         images_list = []

#         try:
#             if OPTION == 'A':
#                 images = WebDriverWait(driver, 10).until(
#                     EC.presence_of_all_elements_located(
#                         (By.XPATH, XPATHS_LIST[0]['A']['images']))
#                 )
#                 OPTION = 'A'
#             else:
#                 images = WebDriverWait(driver, 10).until(
#                     EC.presence_of_all_elements_located(
#                         (By.XPATH, XPATHS_LIST[0]['B']['images']))
#                 )
#                 OPTION = 'B'

#             if images:
#                 for image in images:
#                     images_list.append(image.get_attribute('href'))
#                     print(image.get_attribute('href'))

#         except:
#             error_log_list.append({
#                 'error at': 'images',
#                 'link': driver.current_url,
#                 'time': time.time(),
#                 'screenshot': driver.get_screenshot_as_png()
#             })

#         # get product description
#         description = []
#         try:
#             if OPTION == 'A':
#                 words = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located(
#                     (By.XPATH, XPATHS_LIST[0]['A']['description'])))
#                 OPTION = 'A'
#             else:
#                 words = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located(
#                     (By.XPATH, XPATHS_LIST[0]['B']['description'])))
#                 OPTION = 'B'

#             # if website is satanaclothes.com then get all the words from the description
#             # if website belfort get only description.length - 5 words

#             if words:
#                 for word in words:
#                     description.append(word.text)

#                 # remove empty ' ' strings
#                 description = list(filter(None, description))
#                 # after , add a \n
#                 description = [x.replace(',', ',\n') for x in description]
#                 # join the list
#                 description = ''.join(description)

#                 print('Description: ', description)

#         except:
#             error_log_list.append({
#                 'error at': 'description',
#                 'link': driver.current_url,
#                 'time': time.time(),
#                 'screenshot': driver.get_screenshot_as_png()
#             })
#             description = ''

#         # get product sizes
#         sizes_list = []
#         try:
#             if OPTION == 'A':
#                 sizes = WebDriverWait(driver, 10).until(
#                     EC.presence_of_all_elements_located(
#                         (By.XPATH, XPATHS_LIST[0]['A']['sizes']))
#                 )
#                 OPTION = 'A'
#             else:
#                 sizes = WebDriverWait(driver, 10).until(
#                     EC.presence_of_all_elements_located(
#                         (By.XPATH, XPATHS_LIST[0]['B']['sizes']))
#                 )
#                 OPTION = 'B'

#             if sizes:
#                 for size in sizes:
#                     actions = ActionChains(driver)

#                 # move to element to click
#                     try:
#                         if OPTION == 'A':
#                             buy_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located(
#                                 (By.XPATH, XPATHS_LIST[0]['A']['buy_button'])))
#                             actions.move_to_element(buy_button).perform()
#                             OPTION = 'A'
#                         else:
#                             buy_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located(
#                                 (By.XPATH, XPATHS_LIST[0]['B']['buy_button'])))
#                             actions.move_to_element(buy_button).perform()
#                             OPTION = 'B'

#                     except:
#                         error_log_list.append({
#                             'error at': 'buy_button',
#                             'link': driver.current_url,
#                             'time': time.time(),
#                             'screenshot': driver.get_screenshot_as_png()
#                         })

#                     # every size is a object with size and stock
#                     size_object = {}

#                     # if size is an option element get value attribute, else get data-option attribute
#                     try:
#                         if size.tag_name == 'option':
#                             size_object['size'] = size.get_attribute('value')
#                         else:
#                             size_object['size'] = size.get_attribute(
#                                 'data-option')
#                     except:
#                         error_log_list.append({
#                             'error at': 'size',
#                             'link': driver.current_url,
#                             'time': time.time(),
#                             'screenshot': driver.get_screenshot_as_png()
#                         })

#                     if size:
#                         size.click()

#                     # if size is not available set stock to 0 and continue
#                     try:
#                         if OPTION == 'A':
#                             buy_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located(
#                                 (By.XPATH, XPATHS_LIST[0]['A']['buy_button'])))
#                             OPTION = 'A'
#                         else:
#                             buy_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located(
#                                 (By.XPATH, XPATHS_LIST[0]['B']['buy_button'])))
#                             OPTION = 'B'

#                         if buy_button:
#                             if buy_button.get_attribute('disabled'):
#                                 size_object['stock'] = 0
#                             else:
#                                 size_object['stock'] = 10
#                     except:
#                         size_object = {}

#                     print(size_object)
#                     sizes_list.append(size_object)
#         except:
#             error_log_list.append({
#                 'error at': 'sizes',
#                 'link': driver.current_url,
#                 'time': time.time(),
#                 'screenshot': driver.get_screenshot_as_png()
#             })

#         # get Category
#         try:
#             # category = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//a[@class='breadcrumb-crumb']"))).text
#             # category = WebDriverWait(driver, 10).until(EC.presence_of_element_located(
#             #     (By.XPATH, XPATHS_LIST[0]['A']['category']) or (By.XPATH, XPATHS_LIST[0]['B']['category']))).text

#             if OPTION == 'A':
#                 category = WebDriverWait(driver, 10).until(EC.presence_of_element_located(
#                     (By.XPATH, XPATHS_LIST[0]['A']['category']))).text
#                 OPTION = 'A'
#             else:
#                 category = WebDriverWait(driver, 10).until(EC.presence_of_element_located(
#                     (By.XPATH, XPATHS_LIST[0]['B']['category']))).text
#                 OPTION = 'B'

#             if category:
#                 print('Category: ', category)

#         except:
#             error_log_list.append({
#                 'error at': 'category',
#                 'link': driver.current_url,
#                 'time': time.time(),
#                 'screenshot': driver.get_screenshot_as_png()
#             })

#     # create product model or update if exists,  based on original_url

#         is_active = True
#         if error_log_list > 0:
#             is_active = False

#         product, created = Product.objects.update_or_create(
#             original_url=link,
#             defaults={
#                 'user': user,
#                 'brand': 'Scrapped Product',
#                 'name': name,
#                 'price': price,
#                 'description': description,
#                 'category': category,
#                 'original_url': link,
#                 'is_scraped': True,
#                 'is_active': is_active,
#             }
#         )

#         product.save()

#         # create product image model or update if exists,  based on product and original_url
#         for image in images_list:
#             # donwload image and create image model
#             image_content = requests.get(image).content
#             image_name = image.split('/')[-1]
#             image_file = ContentFile(image_content, image_name)

#             product_image, created = ProductImage.objects.update_or_create(
#                 product=product,
#                 original_url=image,
#                 defaults={
#                     'image': image_file,
#                     'original_url': image,
#                 }
#             )

#             product_image.save()

#         # create product size model or update if exists
#         for size in sizes_list:
#             product_size, created = Size.objects.update_or_create(
#                 # always update stock and size
#                 product=product,
#                 size=size['size'],
#                 defaults={
#                     'stock': size['stock'],
#                     'size': size['size'],
#                 }
#             )
#             product_size.save()

#         print("scraped product")

#     print('Products scraped n saved in products.json ;)')
#     driver.quit()


# # lets start a new thread to run the scraper
# thread = threading.Thread(target=scraper)
# thread.start()

# lets start again the scraper

# maybe 2 functions, one for the scraper and one for the thread

# or maybe a function per prcess and a function to start all the processes


XPATHS_LIST = [
    {
        'A': {
            'products': "//div[contains(@data-component,'product-list-item')]",
            'link': ".//a",
            'name': "//h1",
            'price': "//span[@id='price_display']",
            'images': "//div[@class='cloud-zoom-wrap']/a",
            'words': "//div[contains(@class,'js-product-left-col')]/div[contains(@class,'product-description')]/p",
            'sizes': "//div[contains(@data-variant,'Talle')]/div/a",
            'buy_button': "//div[contains(@class,'product-buy-container')]/input",
            # 'colors': "//div[contains(@class,'product-variants')]/div[contains(@class,'product-variant')]/div[contains(@class,'product-variant-option')]/a",
            'category': "//a[@class='breadcrumb-crumb']",
        },
        'B': {
            'products': "//div[contains(@class,'item-description')]",
            'link': ".//a",
            'name': "//h1",
            'price': "//h3[@id='price_display']",
            'images': "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]/div/a",
            'words': "//div[contains(@class,'product-description')]/p",
            'sizes': "//form[@id='product_form']//label[text()='Talle']/following-sibling::select/option",
            'buy_button': "//form[@id='product_form']//input[contains(@class,'js-addtocart')]",
            'category': "//div[contains(@class,'breadcrumbs')]/a",
        }
    }
]



user = User.objects.get(id=1)   

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
driver = webdriver.Chrome(
    executable_path="chromedriver.exe", options=options)

# driver.get('https://www.satanaclothes.com/productos/?mpage=1')
driver.get('https://elclubdelsweater.com/verano/chalecos/')
driver.maximize_window()
error_log_list = []

# def getProductsLinks(OPTION):
#     try:
#         products = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, XPATHS_LIST[0][OPTION]['products'])))
#         print('Products: ', len(products))
#     except:
#         error_log_list.append({
#             'error at': 'products',
#             'link': driver.current_url,
#             'time': time.time(),
#             'screenshot': driver.get_screenshot_as_png()
#         })

#     links = []

#     for product in products:
#         link = WebDriverWait(product, 10).until(EC.presence_of_element_located((By.XPATH, XPATHS_LIST[0][OPTION]['link']))).get_attribute('href')
#         links.append(link)

#     for link in links:
#         print(link)

# try get links with active xpath A and if not, try with B

try:
    getProductsLinks('A')
except:
    try:
        getProductsLinks('B')
    except:
        error_log_list.append({
            'error at': 'getProductsLinks',
            'link': driver.current_url,
            'time': time.time(),
            'screenshot': driver.get_screenshot_as_png()
        })


