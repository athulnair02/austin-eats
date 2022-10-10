# -------------
# Scrape.py
# -------------

# -------
# imports
# -------

import sys
import requests # another project uses the requests module, let's get this installed somehow for easy Python requesting
# add other important imports here?
# import flask from ur mom?

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


# Culture Data
def scrape_culture():
    """
    scrape_culture scrapes the country data for a [Culture Model] from a given Culture name
    We will scrape from RESTCountries.
    The results are stored in a Cultures JSON.
    """
    # https://restcountries.com/v2/name/india where india is {country_name}
    # Better yet, we likely want to just search from Demonym, provided from YELP or ChowNow: https://restcountries.com/v2/demonym/American


# ChowNow Restaurant Data, ChowNow Menu Data, YELP Restaurant Data
def scrape_yelp_location():
    """
    scrape_yelp_location scrapes the YELP place data for a [Restaurant Model] from a given Restaurant name
    We will initially try using YELP Search Suggest API to find the "biz/restaurant-name-austin" to then use /businesses/{id}.
    If Search Suggest fails us, we have to use /businesses/search to locate the business, then use /businesses/{id}.
    The result is stored in a yelp_data object within the Restaurant in the Restaurants JSON.
    NOTE: Yelp allows 5000 calls every 24 hours.
    """
    # Use either to find the business on YELP, Search suggest takes priority (easier call, inexpensive):
    #   Search Suggest: https://www.yelp.com/search_suggest/v2/prefetch?loc=Austin,%20TX&loc_name_param=loc&is_new_loc=&prefix={RESTAURANT_NAME}&is_initial_prefetch=
    #   Search Businesses: https://api.yelp.com/v3/businesses/search?term=Neworldeli&latitude=30.28701&longitude=-97.74588159999999
    # Then:
    #   Info on Business: https://api.yelp.com/v3/businesses/hoboken-pie-austin where hoboken-pie-austin is the "found" name or id

def scrape_chownow_menu():
    """
    scrape_chownow_menu scrapes the menu for a ChowNow restaurant.
    The result is stored in a menu object within the Restaurant in the Restaurants JSON.
    """
    # https://api.chownow.com/api/restaurant/34481/menu/ where 34481 is {restaurant id}

def scrape_chownow_locations():
    """
    scrape_chownow_locations scrapes locations that have menus in Austin.
    Every chownow location is guaranteed to have a menu associated with the location.
    The results are stored in a Restaurants JSON.
    NOTE: ChowNow does not have a limit on calls, and we will be using one call for many restauarants, so it is negligible.
    """
    # https://api.chownow.com/api/restaurant?pf=1&aggs=cuisines&u_lat=30.28701&u_lon=-97.74588159999999&limit=150
    # Grab 150 restaurants from ChowNow at LAT and LON - Near Guadalupe Street


def main():
    # NOTE:
    # We probably want our scraper to be somewhat intelligent.
    # If we run the scraper again with the same Longitude, Latitude coordinates, we should ensure that the
    # same restaurants, cultures, recipes are NOT added to the JSON files. This will not only save calls but will
    # let us check out different coordinates later down the road when we want to add more instances without duplicates.
    
    print("Running scraper..")
    print("Nothing to be done.. yet..")
    x = requests.get('https://w3schools.com/python/demopage.htm')
    print(x)


if __name__ == "__main__":
    main()