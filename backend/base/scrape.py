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

# https://www.shamrock.com.ar/productos/bermuda-rustica-beige/?variant=531757005

PRODUCTS_XPATHS = [
    "//div[contains(@data-component,'product-list-item')]",
    "//div[contains(@class,'item-description')]",
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
]

IMAGES_XPATHS = [
    "//div[@class='cloud-zoom-wrap']/a",
    "//div[contains(@class,'js-swiper-product')]/div[contains(@class,'swiper-wrapper')]/div/a",
]

WORDS_XPATHS = [
    "//div[contains(@class,'js-product-left-col')]/div[contains(@class,'product-description')]/p",
    "//div[contains(@class,'product-description')]/p",
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
driver = webdriver.Chrome(options=options)

stores = [
    # "https://www.satanaclothes.com/calzas/"
    # "https://www.belforte.com.ar/search/?q=GILDA", #                    10.8 sec per product
    # "https://langlois.com.ar/productos/", #                             7.3 sec per product           
    # "https://www.tiendacry.com.ar/ropa/", #                             4.4 sec per product
    # "https://www.foreverbastard.com/", #                                11.2 sec per product
    # "https://www.shamrock.com.ar/pantalones/", #                        6.2 sec per product
    # "https://baib.com.ar/productos/", #                                 4.2 sec per product
    # "https://www.insublime.ar/hoodie/anime/", #                         8.0 sec per product
    # "https://helsinki.com.ar/productos/", #                             20.0 sec per product
    # "https://overchaosstore.mitiendanube.com/buzos/", #                 9.2 sec per product
    # "https://www.malibuoutfitters.com.ar/coleccion/shorts-de-bano/", #  7.4 sec per product
    # "https://onekickz.com/ar/stock1/sneakers-mpage2/", #                6.0 sec per product
    # "https://rockthatbody.com.ar/tops/", #                              5.2 sec per product
    'https://www.satanaclothes.com/productos/?mpage=1'
]

was_saved = False

for store in stores:
    driver.get(store)
    driver.maximize_window()

    error_log_list = []
    products_list = []


    def waitForElement(xpath, driver, max_time, multi):
        if multi == True:
            result = WebDriverWait(driver, max_time).until(
                EC.presence_of_all_elements_located((By.XPATH, xpath)))
            return result
        else:
            result = WebDriverWait(driver, max_time).until(
                EC.presence_of_element_located((By.XPATH, xpath)))
            return result


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

    try:
        products_time = time.time()
        products = waitForElement(
            PRODUCTS_XPATHS[lucky_product_xpath], driver, 0.2, True)
        products_time = time.time() - products_time
        print(len(products), 'products found in', products_time, 'seconds with lucky xpath')

    except:
        for product_xpath in PRODUCTS_XPATHS:
            try:
                products_time = time.time()
                products = waitForElement(product_xpath, driver, 0.2, True)
                products_time = time.time() - products_time
                print(len(products), 'products found in', products_time, 'seconds')
                lucky_product_xpath = PRODUCTS_XPATHS.index(product_xpath)
                break
            except:
                pass

    if len(products) == 0:
        print('No products found')
        driver.quit()
        exit()

    scraping_time = time.time()
    for product in products:
        try:
            link_time = time.time()
            link = waitForElement(LINK_XPATHS[lucky_link_xpath], product, 0.03, False).get_attribute('href')
            link_time = time.time() - link_time
            if 'tabla-de-talles' not in link:
                print('Link found in', link_time, 'seconds with lucky xpath')
                links.append(link)
        except:
            for link_xpath in LINK_XPATHS:
                try:
                    link_time = time.time()
                    link = waitForElement(link_xpath, product, 0.05, False).get_attribute('href')
                    link_time = time.time() - link_time
                    if 'tabla-de-talles' not in link:
                        print('Link found in', link_time, 'seconds')
                        links.append(link)
                        lucky_link_xpath = LINK_XPATHS.index(link_xpath)
                        break
                except:
                    pass

        if len(links) == 0:
            print('No link found')
            driver.quit()
            exit()


    for link in links:
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
            print('Name found in', name_time, 'seconds with lucky xpath')
        except:
            for name_xpath in NAME_XPATHS:
                try:
                    name_time = time.time()
                    name = waitForElement(name_xpath, driver, 0.25, False).text
                    name_time = time.time() - name_time
                    print('Name found in', name_time, 'seconds')
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
            print('Price found in', price_time, 'seconds with lucky xpath')
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

        # Get Images
        try:
            images_time = time.time()
            images = waitForElement(
                IMAGES_XPATHS[lucky_images_xpath], driver, 0.23, True)
            images_time = time.time() - images_time
            print('Images found in', images_time, 'seconds with lucky xpath')
        except:
            for images_xpath in IMAGES_XPATHS:
                try:
                    images_time = time.time()
                    images = waitForElement(
                        images_xpath, driver, 0.23, True)
                    images_time = time.time() - images_time
                    print('Images found in', images_time, 'seconds')
                    lucky_images_xpath = IMAGES_XPATHS.index(images_xpath)
                    break
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
            print(len(words), 'words found in', words_time, 'seconds with lucky xpath')
        except:
            for words_xpath in WORDS_XPATHS:
                try:
                    words_time = time.time()
                    words = waitForElement(
                        words_xpath, driver, 0.2, True)
                    words_time = time.time() - words_time
                    print(len(words), 'words found in', words_time, 'seconds')
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

        # Get Category
        try:
            category_time = time.time()
            category = waitForElement(
                CATEGORY_XPATHS[lucky_category_xpath], driver, 0.3, False).text
            category_time = time.time() - category_time
            print('Category found in', category_time, 'seconds with lucky xpath')
        except:
            for category_xpath in CATEGORY_XPATHS:
                try:
                    category_time = time.time()
                    category = waitForElement(
                        category_xpath, driver, 0.3, False).text
                    category_time = time.time() - category_time
                    print('Category found in', category_time, 'seconds')
                    lucky_category_xpath = CATEGORY_XPATHS.index(category_xpath)
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
            print('Buy button found in', buy_button_time, 'seconds with lucky xpath')
        except:
            for buy_button_xpath in BUY_BUTTON_XPATHS:
                try:
                    buy_button_time = time.time()
                    buy_button = waitForElement(
                        buy_button_xpath, driver, 0.01, False)
                    buy_button_time = time.time() - buy_button_time
                    print('Buy button found in', buy_button_time, 'seconds')
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
                colors = waitForElement(COLORS_XPATHS[lucky_colors_xpath], driver, 0.1, True)
                colors_time = time.time() - colors_time
                print(len(colors), 'colors found in', colors_time, 'seconds with lucky xpath')
            except:
                for colors_xpath in COLORS_XPATHS:
                    try:
                        colors_time = time.time()
                        colors = waitForElement(
                            colors_xpath, driver, 0.1, True)
                        colors_time = time.time() - colors_time
                        print(len(colors), 'colors found in', colors_time, 'seconds')
                        lucky_colors_xpath = COLORS_XPATHS.index(colors_xpath)
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
                    sizes = waitForElement(SIZES_XPATHS[lucky_sizes_xpath], driver, 0.02, True)
                    sizes_time = time.time() - sizes_time
                    print(len(sizes), 'sizes found in', sizes_time, 'seconds with lucky xpath')
                except:
                    for sizes_xpath in SIZES_XPATHS:
                        try:
                            sizes_time = time.time()
                            sizes = waitForElement(
                                sizes_xpath, driver, 0.02, True)
                            sizes_time = time.time() - sizes_time
                            print(len(sizes), 'sizes found in', sizes_time, 'seconds')
                            lucky_sizes_xpath = SIZES_XPATHS.index(sizes_xpath)
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
                        color_obj['color'] = color.get_attribute('value').capitalize()
                        is_span = WebDriverWait(driver, 0.1).until(EC.presence_of_element_located((By.XPATH, "//div[contains(@data-variant,'Color')]/div/a/span[@data-name='" + color.get_attribute("value") + "']")))
                        is_span.click()
                        sleep(1)
                    except:
                        color_obj['color'] = color.get_attribute('value').capitalize()
                        color.click()
                        sleep(1)

                    # Get Sizes
                    sizes_list = []
                    try:
                        sizes_time = time.time()
                        sizes = waitForElement(
                            SIZES_XPATHS[lucky_sizes_xpath], driver, 0.02, True)
                        sizes_time = time.time() - sizes_time
                        print(len(sizes), 'sizes found in', sizes_time, 'seconds with lucky xpath')
                    except:
                        for sizes_xpath in SIZES_XPATHS:
                            try:
                                sizes_time = time.time()
                                sizes = waitForElement(
                                    sizes_xpath, driver, 0.02, True)
                                sizes_time = time.time() - sizes_time
                                print(len(sizes), 'sizes found in', sizes_time, 'seconds')
                                lucky_sizes_xpath = SIZES_XPATHS.index(sizes_xpath)
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

        product = {
            'name': name,
            'price': price,
            'images': len(images),
            'description': description,
            'category': category,
            'colors': colors_list,
            'link': driver.current_url,
            'time_scraped': time.time()
        }
        products_list.append(product)

        total_name_time = total_name_time + name_time
        total_price_time = total_price_time + price_time
        total_images_time = total_images_time + images_time
        total_words_time = total_words_time + words_time
        total_category_time = total_category_time + category_time
        total_buy_button_time = total_buy_button_time + buy_button_time
        total_sizes_time = total_sizes_time + sizes_time


    print(len(error_log_list), 'errors_log found')
    print(len(products), 'products found')
    print(len(links), 'links found')

    print('average name time:', total_name_time / len(products))
    print('average price time:', total_price_time / len(products))
    print('average images time:', total_images_time / len(products))
    print('average words time:', total_words_time / len(products))
    print('average category time:', total_category_time / len(products))
    print('average buy button time:', total_buy_button_time / len(products))
    print('average sizes time:', total_sizes_time / len(products))

    print('average time per element:', (total_name_time + total_price_time + total_images_time + total_words_time + total_category_time + total_buy_button_time + total_sizes_time) / len(products))

    scraping_time = time.time() - scraping_time
    print('Scraping time:', scraping_time, 'seconds, average time per product:', scraping_time / len(products), 'seconds, (', len(products), 'products )')

    if was_saved == False:    
        # Save Error Log
        out_file = open('error_log.json', 'w')
        json.dump(error_log_list, out_file, indent=4)
        out_file.close()

        # Save products
        out_file = open("final_list.json", "w")
        json.dump(products_list, out_file, indent=6)
        out_file.close()
        was_saved = True
    else:
        # Save products with the products already scraped
        with open('final_list.json') as json_file:
            data = json.load(json_file)
            for product in products_list:
                data.append(product)
            out_file = open("final_list.json", "w")
            json.dump(data, out_file, indent=6)
            out_file.close()

        # Save Error Log with the errors already scraped
        with open('error_log.json') as json_file:
            data = json.load(json_file)
            for error in error_log_list:
                data.append(error)
            out_file = open("error_log.json", "w")
            json.dump(data, out_file, indent=4)
            out_file.close()

print('final_list.json saved in JSON file ;)')
