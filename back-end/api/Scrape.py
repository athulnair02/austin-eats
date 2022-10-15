# -------------
# Scrape.py
# -------------

# -------
# imports
# -------

from datetime import date
import datetime, time
import sys, json, os, string
import requests, cloudscraper
# add other important imports here?
# import flask from ur mom?

# important file paths
SCRAPE_DIR_PATH = "./"
SCRAPE_DIR_NAME = "ScrapeJSONs"
SCRIPT_PATH = os.path.realpath(os.path.dirname(__file__))

# JSON file paths
JSON_INDENT = 4
CALL_ATTEMPTS = 3
CHOWNOW_JSON_PATH = SCRAPE_DIR_PATH + SCRAPE_DIR_NAME + "/Chownow.json"
RESTAURANTS_JSON_PATH = SCRAPE_DIR_PATH + SCRAPE_DIR_NAME + "/Restaurants.json"

# API secrets
# TODO: move this elsewhere
YELP_API_KEY = "KuNWg0Er3A7eKM_pUOJ9TaDy4N9PIWkD63QfZ9mWRKdEoloAq7K9qGtG8vfO68A6d8vGG2EGMXC5BR7Cqnk6BKLtw5hBlIrjI_Eq7MWJQTNxuTflLx0vpvlvktwwY3Yx"
SPOONACULAR_API_KEY = ""

"""
Scrape Process
OVERVIEW:
    - Restaurants: Restaurants we scrape MUST contain data in Yelp, as it defines a Restaurant Model
        -> Recipes: Restaurants must have a Menu that can be used to scrape Recipes from popular Menu items (MANY recipes)
        -> Culture: Restaurants must have a "tag" or "culture" within the scrape to query the country the culture belongs to (FEW cultures)
    - Recipes: Recipes we scrape from [Restaurant ChowNow Menu Items] must exist (if not, we must keep searching in the menu for other items)
        -> Restaurants: Recipes must be associated with (MANY restaurants)
        -> Culture: Recipes must be related to a (FEW cultures)
    - Culture: Cultures we scrape from [Restaurants] must exist
        -> Restaurants: Cultures must be associated with (MANY restaurants)
        -> Recipes: Cultures must be related to (MANY recipes)

SCRAPE PROCESS:
    * When scraping, it is important that locations that we scrape contain menus. A location without a menu is not of use to us
    because it must be related to Recipe Models.
    - It is wise to start from ChowNow, a Restaurant [Menu API] that contains fewer locations than Yelp.
        -> From ChowNow, we can feed the Restaurant name into Yelp to find the Restaurant Model data
        -> From ChowNow, we can feed popular Restaurant menu items into Spoonacular to find data on multiple Recipe Models.
    - From each scrape, we can save it into a corresponding JSON file: ChowNow, Yelp, and Spoonacular

AFTER DB AND MODELS CREATED:
    - Later we will run through these JSONs to covert the API variables to our Postman schema variables, including removing
    junk, unneeded variables. We will then load them into our working database.
"""

# -------
# other methods
# -------

def get_next_weekday(weekday_num):
    today = date.today()
    return today + datetime.timedelta( (weekday_num - today.weekday()) % 7 )

def create_json_file(file_path):
    """
    creates a json file with a list at the specified path if it does not exist
    """
    file_exists = os.path.exists(file_path)
    if(not file_exists):
        with open(file_path, 'w') as file:
            json.dump([], file, indent = JSON_INDENT)

def parse_yes_from_input(inputStr):
    return any(inputStr.lower() == f for f in ["yes", 'y', '1'])

def call_with_attempts(url, use_cloudscraper = False, auth = None, attempts = CALL_ATTEMPTS):
    scraper = cloudscraper.create_scraper(browser={'browser': 'firefox','platform': 'windows','mobile': False})
    response = None
    auth_header = None
    if auth:
        auth_header = {"Authorization": "Bearer " + auth}
    
    for i in range(attempts):
        if use_cloudscraper:
            response = scraper.get(url)
        else:
            response = requests.get(url, headers = auth_header)
        
        if response.status_code != 429:
            break
        if i < (attempts - 1):
            time.sleep(300/1000)
    if response == None:
        return -1
    if response.status_code != 200:
        if response.status_code == 401:
            print("Unauthorized for {0}. Did you forget an auth token?".format(url))
        return response.status_code
    if use_cloudscraper:
        return json.loads(response.content.decode('utf8'))
    return response.json()

# -------
# scrape methods
# -------

# Recipe Data
def scrape_recipes():
    """
    scrape_recipes scrapes recipes data for multiple [Recipe Model] from a given Restaurant Menu item name
    We will scrape from Spoonacular. It might be important to store the original menu item query somewhere in the recipe,
    should Spoonacular's Recipe names vary significantly from the search query.
    The results are stored in a Recipes JSON.
    """
    # https://api.spoonacular.com/recipes/complexSearch?query={MENU_ITEM_NAME}&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true&addRecipeNutrition=true
    # Do we lock the Recipes it returns to the specific cuisine of the restaurant? Add &cuisine={demonym} (Italian, Mexican, etc.)
    pass

# Culture Data
def scrape_culture():
    """
    scrape_culture scrapes the country data for a [Culture Model] from a given Culture name
    We will scrape from RESTCountries.
    The results are stored in a Cultures JSON.
    """
    # https://restcountries.com/v2/name/india where india is {country_name}
    # Better yet, we likely want to just search from Demonym, provided from YELP or ChowNow: https://restcountries.com/v2/demonym/American
    pass

# ChowNow Restaurant Data, ChowNow Menu Data, YELP Restaurant Data
def scrape_yelp_location(restaurant: dict, latitude: float, longitude: float):
    """
    scrape_yelp_location scrapes the YELP place data for a ChowNow restaurant.
    We will initially try using YELP Search Suggest API to find the "biz/restaurant-name-austin" to then use /businesses/{id}.
    If Search Suggest fails us, we have to use /businesses/search to locate the business, then use /businesses/{id}.
    The result is returned. It should be stored in a yelp_data object within the Restaurant in the Restaurants JSON.
    NOTE: Yelp allows 5000 calls every 24 hours.
    """
    # Use either to find the business on YELP, Search suggest takes priority (easier call, inexpensive):
    #   Search Suggest: https://www.yelp.com/search_suggest/v2/prefetch?loc=Austin,%20TX&loc_name_param=loc&is_new_loc=&prefix={RESTAURANT_NAME}&is_initial_prefetch=
    #   Search Businesses: https://api.yelp.com/v3/businesses/search?term=Neworldeli&latitude=30.28701&longitude=-97.74588159999999
    # Then:
    #   Info on Business: https://api.yelp.com/v3/businesses/hoboken-pie-austin where hoboken-pie-austin is the "found" name or id
    name = restaurant["name"]
    short_name = restaurant["short_name"]
    phone = restaurant["phone"]

    # API request for Yelp business search (used for business data)
    YELP_PHONE_API = "https://api.yelp.com/v3/businesses/search/phone?phone=+1{0}".format(phone)
    YELP_SEARCH_API = "https://api.yelp.com/v3/businesses/search?term={0}&latitude={1}&longitude={2}".format(short_name, latitude, longitude)
    # temp_file = open(SCRAPE_DIR_PATH + SCRAPE_DIR_NAME + "/YelpSearchTEMP.json")
    # search_data = json.load(temp_file)

    # primary method: locate business via phone
    business_id = None
    search_phone_data = call_with_attempts(YELP_PHONE_API, auth = YELP_API_KEY)

    # fail check
    if isinstance(search_phone_data, int):
        return -1
    
    if search_phone_data["total"] == 1:
        business_id = search_phone_data["businesses"][0]["id"]

    # secondary method: locate business via name
    if business_id is None:
        search_data = call_with_attempts(YELP_SEARCH_API, auth = YELP_API_KEY)

        # fail check
        if isinstance(search_data, int):
            return -1

        # locate yelp restaurant from business search
        business_names = []
        for business in search_data["businesses"]:
            yelp_name = business["name"]
            yelp_phone = business["phone"]
            yelp_alias = business["alias"]
            business_names.append(yelp_name)
            if (yelp_name in short_name) or (short_name in yelp_name) or (phone in yelp_phone) or (short_name.lower().replace(" ", "-").replace("'", "-").replace("&", "and") in yelp_alias):
                business_id = business["id"]
                break
    
    if business_id is None:
        print("\t\t\t YELP place not found; perform manual review: chownow short_name: {0} yelp names: {1}".format(short_name, business_names))
        return -1
    
    # API request yelp restaurant details
    YELP_RESTAURANT_API = "https://api.yelp.com/v3/businesses/{0}".format(business_id)
    # temp_file = open(SCRAPE_DIR_PATH + SCRAPE_DIR_NAME + "/YelpBusinessTEMP.json")
    # business_data = json.load(temp_file)
    business_data = call_with_attempts(YELP_RESTAURANT_API, auth = YELP_API_KEY)

    # fail check
    if isinstance(business_data, int):
        return -1
    
    # API request yelp review details
    YELP_REVIEWS_API = "https://api.yelp.com/v3/businesses/{0}/reviews".format(business_id)
    reviews_data = call_with_attempts(YELP_REVIEWS_API, auth = YELP_API_KEY)

    # fail check
    if isinstance(reviews_data, int):
        return -1
    
    return {"restaurant": business_data, "reviews": reviews_data["reviews"]}

def scrape_chownow_menu(restaurant: dict):
    """
    scrape_chownow_menu scrapes the menu for a ChowNow restaurant.
    The result is returned. It should be stored in a menu object within the Restaurant in the Restaurants JSON.
    """
    id = restaurant["id"]
    name = restaurant["name"]

    # API request for ChowNow place details (for menu timestamp data)
    CHOWNOW_PLACE_API = "https://api.chownow.com/api/restaurant/{0}".format(id)
    # scraper = cloudscraper.create_scraper(browser={'browser': 'firefox','platform': 'windows','mobile': False})
    # response = scraper.get(CHOWNOW_PLACE_API)
    # place_data = json.loads(response.content.decode('utf8'))

    place_data = call_with_attempts(CHOWNOW_PLACE_API, True)

    # temp_file = open(SCRAPE_DIR_PATH + SCRAPE_DIR_NAME + "/ChownowPlaceTEMP.json")
    # place_data = json.load(temp_file)

    # fail check
    if isinstance(place_data, int):
        return -1

    # retrieve dinner / lunch menu timestamp
    # today = date.today()
    pickup_hours = place_data["fulfillment"]["pickup"]["display_hours"]
    day = None
    for hours in pickup_hours:
        if len(hours["ranges"]) > 0:
            day = hours
            break
    if day is None:
        print("\t\t\t Chownow display_hours not found; perform manual review: {0}".format(name))
        return -1

    # menu_timestamp = today.strftime("%Y%m%d") + range_hours[-1]["from"].replace(':', '')
    menu_timestamp = get_next_weekday((day["day_id"] - 2) % 7).strftime("%Y%m%d") + day["ranges"][-1]["from"].replace(':', '')

    # API request for the ChowNow restaurant menu
    CHOWNOW_MENU_API = "https://api.chownow.com/api/restaurant/{0}/menu/{1}".format(id, menu_timestamp)
    # print(CHOWNOW_MENU_API)
    # response = scraper.get(CHOWNOW_MENU_API)
    # menu_data = json.loads(response.content.decode('utf8'))
    menu_data = call_with_attempts(CHOWNOW_MENU_API, True)

    # temp_file = open(SCRAPE_DIR_PATH + SCRAPE_DIR_NAME + "/MenuTEMP.json")
    # menu_data = json.load(temp_file)

    # fail check
    if isinstance(menu_data, int):
        return -1
    if not menu_data.get("menu_categories"):
        print("\t\t\t Chownow menu_categories not found; perform manual review: {0} - {1}".format(name, menu_timestamp))
        return -1
    
    return menu_data["menu_categories"]

def scrape_restaurants_data(latitude: float, longitude: float):
    """
    scrape_restaurants_data scrapes the menu and YELP place data for all locations in the Chownow JSON.
    Locations that already contain YELP or menu data are skipped.
    The resulting locations [with YELP + menu data] are stored in a Restaurants JSON.
    """
    print("\t\tScraping restaurants data..")

    create_json_file(CHOWNOW_JSON_PATH)
    with open(CHOWNOW_JSON_PATH, 'r', encoding='utf-8') as chownow_file:
        restaurants = json.load(chownow_file)
        num_restaurants = len(restaurants)
        num_menu_failures = 0
        num_menu_calls = 0
        num_yelp_failures = 0
        num_yelp_calls = 0
        num_done = 0
        failed_restaurants = {}

        # dump menu + yelp data into Restaurants json
        create_json_file(RESTAURANTS_JSON_PATH)
        with open(RESTAURANTS_JSON_PATH, 'r+', encoding='utf-8') as file:
            current_restaurants = json.load(file)
            current_restaurants_data = dict([(r["name"], {"index": i, "yelp_exists": r.get("yelp_data"), "menu_exists": r.get("menu_categories")}) for i,r in enumerate(current_restaurants)])
            for restaurant in restaurants:
                # if num_done >= 50:
                #    break

                num_done += 1
                name = restaurant["name"]
                has_data = current_restaurants_data.get(name)

                # take a quick nap
                if not has_data:
                    time.sleep(210/1000)

                # ensure yelp and menu data don't already exist
                if not (has_data and has_data["menu_exists"]):
                    menu = scrape_chownow_menu(restaurant)
                    num_menu_calls += 1
                    if (menu == -1):
                        num_menu_failures += 1
                        failed_restaurants[name] = "MENU"
                        continue
                    restaurant["menu_categories"] = menu
                else:
                    restaurant["menu_categories"] = has_data["menu_exists"]
                
                if not (has_data and has_data["yelp_exists"]):
                    yelp = scrape_yelp_location(restaurant, latitude, longitude)
                    num_yelp_calls += 1
                    if (yelp == -1):
                        num_yelp_failures += 1
                        failed_restaurants[name] = "YELP"
                        continue
                    restaurant["yelp_data"] = yelp
                else:
                    restaurant["yelp_data"] = has_data["yelp_exists"]
                
                # update or append, depending on whether already in Restaurants json
                if not has_data:
                    current_restaurants.append(restaurant)
                else:
                    index = has_data["index"]
                    current_restaurants[index] = restaurant
            
            # update Restaurants json
            file.seek(0)
            json.dump(current_restaurants, file, indent = JSON_INDENT)
    
    if num_restaurants == 0:
        print("\t\tNo restaurants to scrape data for. Scrape ChowNow restaurants first.")
    else:
        menus_gathered = num_restaurants - num_menu_failures
        yelps_gathered = num_restaurants - num_yelp_failures
        print("\n\t\tMenus gathered: {0}/{1}, {2}% success rate, {3} calls made".format(menus_gathered, num_restaurants, int((menus_gathered / num_restaurants) * 100), num_menu_calls))
        print("\t\tYelp data gathered: {0}/{1}, {2}% success rate, {3} calls made".format(yelps_gathered, num_restaurants, int((yelps_gathered / num_restaurants) * 100), num_yelp_calls))
        print("\t\tFailures: {0}".format(failed_restaurants))
        print("\t\tRestaurants json updated.")


def scrape_chownow_locations(latitude: float, longitude: float):
    """
    scrape_chownow_locations scrapes locations that have menus in Austin.
    The locations returned are based off coordinates.
    The results are stored in a Chownow JSON. Duplicates are automatically removed, using Restaurants JSON as a reference.
    NOTE: ChowNow is a "private" API and uses CloudFare, so and we will be using cloudscraper to bypass its protection.
    """
    print("\t\tScraping ChowNow locations..")

    # API request for up to 150 ChowNow restaurants at latitude, longitude
    # cloudflare is annoying, so we are using cloudscraper to behave like a user
    CHOWNOW_API = "https://api.chownow.com/api/restaurant?pf=1&aggs=cuisines&u_lat={0}&u_lon={1}&limit=150".format(latitude, longitude)
    # scraper = cloudscraper.create_scraper(browser={'browser': 'firefox','platform': 'windows','mobile': False})
    # response = scraper.get(CHOWNOW_API)
    # chownow_data = json.loads(response.content.decode('utf8'))
    # temp_file = open(SCRAPE_DIR_PATH + SCRAPE_DIR_NAME + "/ChownowTEMP.json")
    # chownow_data = json.load(temp_file)

    chownow_data = call_with_attempts(CHOWNOW_API, True)

    # fail check
    if isinstance(chownow_data, int):
        print("\t\tChowNow scrape failed: status code {0}".format(chownow_data))
        return

    # dump ChowNow restaurants data into Chownow json file. Additionally, removes duplicate restaurants.
    create_json_file(CHOWNOW_JSON_PATH)
    with open(CHOWNOW_JSON_PATH, 'w', encoding='utf-8') as chownow_file:
        # file_data = json.load(file)

        # remove duplicate restaurants by checking against Restaurants json
        create_json_file(RESTAURANTS_JSON_PATH)
        with open(RESTAURANTS_JSON_PATH, 'r+', encoding='utf-8') as file:
            current_restaurants = {r["name"] for r in json.load(file)}
            nonduplicate_restaurants = [r for r in chownow_data["restaurants"] if not (r["name"] in current_restaurants)]
        
        # convert back to json, write to file
        json.dump(nonduplicate_restaurants, chownow_file, indent = JSON_INDENT)
    
    print("\t\t{0} new locations found.".format(len(nonduplicate_restaurants)))
    print("\t\tChowNow json updated.")


def main():
    # NOTE:
    # The scraper is intelligent, and removes duplicates where necessary, saving on as most calls as possible.
    # If we run the scraper again with the same Longitude, Latitude coordinates, we ensure that the
    # same restaurants, cultures, recipes are NOT added to the JSON files. This will not only save calls but will
    # let us check out different coordinates later down the road when we want to add more instances without duplicates.
    # The scraper outputs success, failure information for debugging purposes.
    
    print("\nRunning scraper..")

    # Create the scrape results directory
    os.chdir(SCRIPT_PATH)
    os.makedirs(SCRAPE_DIR_PATH + SCRAPE_DIR_NAME, exist_ok=True)
    
    # Get latitude, longitude for restaurant scrape
    print("Provide a Latitude and Longitude for restaurant scraping.")
    latitude = float(input("\tLatitude: ") or 30.28701)
    longitude = float(input("\tLongitude: ") or -97.74588159999999)
    
    # Replace Chownow json data? Otherwise just use Chownow json for the rest of the calls
    print("Scraping decisions.")
    to_replace_chownow = input("\tScrape new ChowNow restaurants (y/n): ")
    if parse_yes_from_input(to_replace_chownow):
        scrape_chownow_locations(latitude, longitude)
    
    # Scrape restaurants?
    # [FROM: Chownow json  ADD: ChowNow menu, YELP data  STORE: Restaurants json]
    to_scrape_restaurants = input("\tScrape restaurants data (y/n): ")
    if parse_yes_from_input(to_scrape_restaurants):
        scrape_restaurants_data(latitude, longitude)
    
    # TODO: Scrape cultures?
    # TODO: Scrape recipes?


if __name__ == "__main__":
    main()