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
CULTURES_JSON_PATH = SCRAPE_DIR_PATH + SCRAPE_DIR_NAME + "/Cultures.json"
RECIPES_JSON_PATH = SCRAPE_DIR_PATH + SCRAPE_DIR_NAME + "/Recipes.json"

# API secrets (this is really not very secure)
YELP_API_KEY = ""
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
    - From each scrape, we can save it into a corresponding JSON file: ChowNow (temp-holder for found-restaurants), Restaurant (yelp + menu), Culture (cuisine), and Spoonacular (recipe)

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

def create_json_file(file_path, default_data = []):
    """
    creates a json file with a list at the specified path if it does not exist
    """
    file_exists = os.path.exists(file_path)
    if(not file_exists):
        with open(file_path, 'w') as file:
            json.dump(default_data, file, indent = JSON_INDENT)

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
def scrape_recipes(query: str):
    """
    scrape_recipes scrapes recipes data from a given Restaurant Menu item name (the query)
    We will scrape from Spoonacular. It might be important to store the original menu item query somewhere in the recipe,
    should Spoonacular's Recipe names vary significantly from the search query.
    The results are returned. They should be stored in a Recipes JSON.
    """
    # https://api.spoonacular.com/recipes/complexSearch?query={MENU_ITEM_NAME}&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true&addRecipeNutrition=true
    # Do we lock the Recipes it returns to the specific cuisine of the restaurant? Add &cuisine={demonym} (Italian, Mexican, etc.)
    # time.sleep(50/1000)

    # # Determine whether the query is a good fit for recipes
    # SPOONACULAR_SEARCH_API = "https://spoonacular.com/search/all?site=spoonacular.com&includeContent=false&limit=5&limitPerGroup=true&query={0}&kvtable=false&complexFilterFormat=false".format(query)
    # search_data = call_with_attempts(SPOONACULAR_SEARCH_API)

    # # fail check
    # if isinstance(search_data, int):
    #     return -1
    # for category in search_data["searchResults"]:
    #     if category["name"] == "Recipes" and category["totalResults"] <= 3:
    #         return -1
    # return query

    # take a quick nap
    time.sleep(210/1000)
    query = query.strip()

    # API call to receive up to 10 recipes per query
    SPOONACULAR_RECIPE_API = "https://api.spoonacular.com/recipes/complexSearch?query={0}&instructionsRequired=true&addRecipeInformation=true&fillIngredients=true&addRecipeNutrition=true&number=10&apiKey={1}".format(query, SPOONACULAR_API_KEY)
    recipes_data = call_with_attempts(SPOONACULAR_RECIPE_API)

    # fail check
    if isinstance(recipes_data, int):
        return -1
    if recipes_data["totalResults"] < 1:
        print("\t\t\tNo recipes found for query: '{0}' Perform manual correction.".format(query))
    return recipes_data["results"]

def scrape_recipes_data():
    """
    scrape_recipes_data scrapes the recipes data for restaurants in the Restaurants JSON.
    Restaurants that already contain chosen recipes are skipped.
    The resulting recipes data are stored in a Recipes JSON, and Restaurants are given a recipe_items field.
    """
    print("\t\tScraping recipes data..")

    # add instructions_minutes field to recipe
    def add_instructions_minutes(recipe):
        instructions = recipe.get("analyzedInstructions")
        if instructions and recipe.get("instructions_minutes") is None:
            minutes = 0
            for step in instructions[0]["steps"]:
                step_time = step.get("length")
                if step_time:
                    minutes += step_time["number"]
            recipe["instructions_minutes"] = minutes

    create_json_file(RESTAURANTS_JSON_PATH)
    with open(RESTAURANTS_JSON_PATH, 'r+', encoding='utf-8') as file:
        current_restaurants = json.load(file)
        num_restaurants = len(current_restaurants)
        num_spoonacular_failures = 0
        num_spoonacular_calls = 0
        num_done = 0
        failed_recipes = set()

        create_json_file(RECIPES_JSON_PATH, {"acceptable_menu_items": [], "already_scraped_items": [], "menu_items_lookup": {}, "menu_items_to_cuisines": {}, "recipes": []})
        with open(RECIPES_JSON_PATH, 'r+', encoding='utf-8') as file:
            current_recipes_data = json.load(file)
            accepted_items = current_recipes_data["acceptable_menu_items"]
            already_scraped_items = current_recipes_data["already_scraped_items"]
            menu_items_lookup = current_recipes_data["menu_items_lookup"]
            menu_items_to_cuisines = current_recipes_data["menu_items_to_cuisines"]
            current_recipes = current_recipes_data["recipes"]

            def add_cuisines(recipe):
                cuisines = recipe.get("cuisines")
                if len(cuisines) < 1:
                    dish_name = recipe["dish_name"]
                    cuisines_from = menu_items_to_cuisines.get(dish_name)
                    if cuisines_from is not None:
                        recipe["cuisines"] = cuisines_from
                    else:
                        print("\t\t\tNo menu_items_to_cuisines for dish {0}. Perform manual review.".format(dish_name))
            
            # append extra fields current recipes, if not already existing
            for recipe in current_recipes:
                add_instructions_minutes(recipe)
                add_cuisines(recipe)

            # gather recipes data from restaurants
            for restaurant in current_restaurants:
                # if num_done >= 10:
                #    break

                name = restaurant["name"]
                menu_data = restaurant.get("menu_categories")
                if menu_data is None:
                    print("\t\t\tNo menu_categories in Restaurant {0}. Scrape restaurants data first.".format(name))
                    continue

                num_done += 1
                num_acceptable_items = 0
                # search through menu items (yes, i know its order N cubed, no i do not care, phase 2 is almost due)
                for menu_category in menu_data:
                    for item in menu_category["items"]:
                        for accepted_item in accepted_items:
                            # guard statement: no partial match found for menu name
                            item_name = item["name"]
                            if accepted_item.lower() not in item_name.lower():
                                continue
                            num_acceptable_items += 1

                            # name lookup
                            accepted_name_query = menu_items_lookup.get(accepted_item) or accepted_item
                            if accepted_name_query in already_scraped_items:
                                continue
                            
                            # recipe scrape
                            num_spoonacular_calls += 1
                            recipes_data = scrape_recipes(accepted_name_query)
                            if recipes_data == -1:
                                num_spoonacular_failures += 1
                                failed_recipes.add(accepted_name_query)

                            # store recipes
                            already_scraped_items.append(accepted_name_query)
                            for recipe in recipes_data:
                                recipe["dish_name"] = accepted_name_query.strip()
                                add_instructions_minutes(recipe)
                                add_cuisines(recipe)
                                current_recipes.append(recipe)
                            break
                if num_acceptable_items == 0:
                    print("\t\t\tNo acceptable menu items for Restaurant {0}. Check that menu_categories items map to acceptable items.".format(name))
            # update Recipes json
            file.seek(0)
            json.dump(current_recipes_data, file, indent = JSON_INDENT)
    
    if num_restaurants == 0:
        print("\t\tNo restaurants to scrape data for. Scrape restaurants data first.")
    else:
        spoonacular_gathered = num_restaurants - num_spoonacular_failures
        print("\n\t\tRestaurants with Recipes gathered: {0}/{1}, {2}% success rate, {3} calls made".format(spoonacular_gathered, num_restaurants, int((spoonacular_gathered / num_restaurants) * 100), num_spoonacular_calls))
        print("\t\tFailures: {0}".format(failed_recipes))
        print("\t\tRecipes json updated.")

# Culture Data
def scrape_wikipedia_culture(country: str):
    """
    scrape_wikipedia_culture scrapes the wikipedia page content from a given country name
    We will scrape from Wikipedia API.
    The result is returned. It should be stored in the Cultures JSON.
    """

    # API request country wikipedia page summary
    WIKIPEDIA_API = "https://en.wikipedia.org/api/rest_v1/page/summary/{0}?redirect=true".format(country)
    wikipedia_data = call_with_attempts(WIKIPEDIA_API)

    # fail check
    if isinstance(wikipedia_data, int):
        return -1
    return wikipedia_data["extract"]

def scrape_culture(culture: str, lookup_type: str):
    """
    scrape_culture scrapes the country data for a culture from a given culture string. (Mexican, United States of America)
    The lookup_type defines the search query. (demonym, name)
    We will scrape from RESTCountries API.
    The result is returned. It should be stored in the Cultures JSON.
    """

    # API request country details
    RESTCOUNTRIES_API = "https://restcountries.com/v2/{0}/{1}".format(lookup_type, culture)
    countries_data = call_with_attempts(RESTCOUNTRIES_API)

    # fail check
    if isinstance(countries_data, int):
        return -1
    
    # if more than one, we must find the equal match
    country_data = countries_data[0]
    if len(countries_data) > 1:
        found_match = False
        for country in countries_data:
            if country["name"] == culture or country["demonym"] == culture or country["nativeName"] == culture:
                country_data = country
                found_match = True
        if not found_match:
            print("Multiple countries found for name: {0}. No equal match found. Perform manual correction.".format(culture))
            return -1
    return country_data

def scrape_cultures_data():
    """
    scrape_cultures_data scrapes the culture and wikipedia page data for all restaurants in the Restaurants JSON.
    Restaurants with cultures that already exist are skipped.
    The resulting cultures data are stored in a Cultures JSON.
    """
    print("\t\tScraping cultures data..")

    create_json_file(RESTAURANTS_JSON_PATH)
    with open(RESTAURANTS_JSON_PATH, 'r+', encoding='utf-8') as file:
        current_restaurants = json.load(file)
        num_restaurants = len(current_restaurants)
        num_restcountry_failures = 0
        num_restcountry_calls = 0
        num_wikipedia_failures = 0
        num_wikipedia_calls = 0
        num_done = 0
        failed_cultures = {}

        create_json_file(CULTURES_JSON_PATH, {"culture_lookup": {}, "cultures": []})
        with open(CULTURES_JSON_PATH, 'r+', encoding='utf-8') as file:
            cultures_data = json.load(file)
            culture_lookup = cultures_data["culture_lookup"]
            current_cultures = cultures_data["cultures"]
            current_cultures_data_name = dict([(r["name"], {"index": i, "wikipedia_exists": r.get("wikipedia_summary")}) for i,r in enumerate(current_cultures)])
            current_cultures_data_demonym = dict([(r["demonym"], {"index": i, "wikipedia_exists": r.get("wikipedia_summary")}) for i,r in enumerate(current_cultures)])
            culture_cache = {}

            # gather cultures/countries list from restaurant cuisine lists
            def scrape_cultures_from_cuisine(cuisine: str):
                nonlocal num_restcountry_failures
                nonlocal num_restcountry_calls
                nonlocal num_wikipedia_failures
                nonlocal num_wikipedia_calls
                
                counted_cultures = 0
                countries_list = culture_lookup.get(cuisine)
                lookup_type = "name"
                if countries_list is None:
                    countries_list = [cuisine]
                    lookup_type = "demonym"
                
                for culture in countries_list:
                    if culture_cache.get(culture):
                        counted_cultures += 1
                        continue

                    has_data = current_cultures_data_name.get(culture) or current_cultures_data_demonym.get(culture)
                    if not has_data:
                        # take a quick nap
                        time.sleep(210/1000)

                        # culture scrape
                        culture_data = scrape_culture(culture, lookup_type)
                        num_restcountry_calls += 1
                        if (culture_data == -1):
                            num_restcountry_failures += 1
                            failed_cultures[culture] = lookup_type
                            continue
                        if lookup_type == "name" and culture_data["name"] != culture:
                            num_restcountry_failures += 1
                            culture_cache[culture] = True
                            culture_cache[culture_data["demonym"]] = True
                            print("\t\t\t Name lookup must match RestCountry name to prevent duplicates: change '{0}' to '{1}'.".format(culture, culture_data["name"]))
                            continue
                    else:
                        culture_data = current_cultures[has_data["index"]]
                    
                    counted_cultures += 1
                    culture_cache[culture_data["name"]] = True
                    culture_cache[culture_data["demonym"]] = True

                    # wikipedia summary scrape
                    if not (has_data and has_data["wikipedia_exists"]):
                        country_name = culture_data["name"]
                        wikipedia_summary = scrape_wikipedia_culture(country_name)
                        num_wikipedia_calls += 1
                        if (wikipedia_summary == -1):
                            num_wikipedia_failures += 1
                            print("\t\t\t Wikipedia summary not found; perform manual review: country: {0}".format(country_name))
                            continue
                        culture_data["wikipedia_summary"] = wikipedia_summary

                    # update or append, depending on whether already in Cultures json
                    if not has_data:
                        current_cultures.append(culture_data)
                    else:
                        index = has_data["index"]
                        current_cultures[index] = culture_data
                return counted_cultures
            
            # gather cultures data from restaurants
            for restaurant in current_restaurants:
                #if num_done >= 60:
                #   break

                name = restaurant["name"]
                yelp_data = restaurant.get("yelp_data")
                if yelp_data is None:
                    print("\t\t\tNo yelp_data in Restaurant {0}. Scrape restaurants data first.".format(name))
                    continue

                num_done += 1
                num_cultures = 0
                for cuisine in restaurant["cuisines"]:
                    num_cultures += scrape_cultures_from_cuisine(cuisine)
                for cuisine_data in yelp_data["restaurant"]["categories"]:
                    num_cultures += scrape_cultures_from_cuisine(cuisine_data["title"])
                
                if num_cultures == 0:
                    print("\t\t\tNo cultures for Restaurant {0}. Check that cuisines map to countries.".format(name))
            
            # update Cultures json
            file.seek(0)
            json.dump(cultures_data, file, indent = JSON_INDENT)
    
    if num_restaurants == 0:
        print("\t\tNo restaurants to scrape data for. Scrape restaurants data first.")
    else:
        restcountry_gathered = num_restaurants - num_restcountry_failures
        wikipedia_gathered = num_restaurants - num_wikipedia_failures
        print("\n\t\tCultures gathered: {0}/{1}, {2}% success rate, {3} calls made".format(restcountry_gathered, num_restaurants, int((restcountry_gathered / num_restaurants) * 100), num_restcountry_calls))
        print("\t\tWikipedia summaries gathered: {0}/{1}, {2}% success rate, {3} calls made".format(wikipedia_gathered, num_restaurants, int((wikipedia_gathered / num_restaurants) * 100), num_wikipedia_calls))
        print("\t\tFailures: {0}".format(failed_cultures))
        print("\t\tCultures json updated.")

# ChowNow Restaurant Data, ChowNow Menu Data, YELP Restaurant Data
def scrape_yelp_location(restaurant: dict, latitude: float, longitude: float):
    """
    scrape_yelp_location scrapes the YELP place data for a ChowNow restaurant.
    We will initially try using YELP Search by phone API to find the restaurant id to then use /businesses/{id}.
    If Phone search fails us, we have to use /businesses/search to locate the business by name, then use /businesses/{id}.
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
    
    # Scrape cultures?
    # [FROM: Restaurants json  FOR: Culture data, Wikipedia data  STORE: Cultures json]
    to_scrape_cultures = input("\tScrape cultures data (y/n): ")
    if parse_yes_from_input(to_scrape_cultures):
        scrape_cultures_data()
    
    # Scrape recipes?
    # [FROM: Restaurants json  FOR: Recipe data  STORE: Recipes json]
    to_scrape_recipes = input("\tScrape recipes data (y/n): ")
    if parse_yes_from_input(to_scrape_recipes):
        scrape_recipes_data()


if __name__ == "__main__":
    main()