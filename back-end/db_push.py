from app import db
import json
from models import Restaurant, Culture, Recipe

# TexasVotes code helped a lot with this

RESTAURANT_JSON = "./api/ScrapeJSONs/Restaurants.json"
CULTURE_JSON = "./api/ScrapeJSONs/Cultures.json"
RECIPE_JSON = "./api/ScrapeJSONs/Recipes.json"

def populate_restaurants() :
    print("Starting populate_restaurants()...")
    with open(RESTAURANT_JSON) as f:
        data = json.load(f)
        push_restaurants(data)
    db.session.commit()
    print("Restaurants added!")

def push_restaurants(data) :
    rest_id = 0
    for restaurant in data:

        yelp_data = restaurant.get("yelp_data").get("restaurant")
        all_categories = set()
        for cat in yelp_data.get("categories"):
            all_categories.add(cat.get("title"))
        for cat in restaurant.get("cuisines"):
            all_categories.add(cat)
        
        new_rest = Restaurant(
            id = rest_id,
            name = yelp_data.get("name"),
            image_url = yelp_data.get("image_url"),
            restaurant_url = yelp_data.get("url"),
            display_phone = yelp_data.get("display_phone"),
            categories = list(all_categories),
            rating = yelp_data.get("rating"),
            review_count = yelp_data.get("review_count"),
            display_address = restaurant.get("address").get("place_formatted_address"),
            latlng = [restaurant.get("address").get("latitude"), restaurant.get("address").get("longitude")],
            photos = yelp_data.get("photos"),
            price = yelp_data.get("price"),
            delivery = restaurant.get("is_delivery_available"),
            is_open = yelp_data.get("hours")[0].get("is_open_now"),
            reviews = restaurant.get("yelp_data").get("reviews")
        )

        # link Restaurants --> Cultures
        with open(CULTURE_JSON) as f:
            data = json.load(f)
            nonduplicate_countries = set()
            for category in new_rest.categories:
                countries_list = data["culture_lookup"].get(category)
                if countries_list is None:
                    countries_list = [countries_list]
                for country in countries_list:
                    nonduplicate_countries.add(country)
            for country in nonduplicate_countries:
                culture_orm = db.session.query(Culture).filter_by(name=country).first() or db.session.query(Culture).filter_by(demonym=country).first()
                if culture_orm:
                    new_rest.cultures.append(culture_orm)
        
        # link Restaurants --> Recipes
        with open(RECIPE_JSON) as rec :
                rec_data = json.load(rec)
                nonduplicate_recipes = set()
                accepted_items = rec_data["acceptable_menu_items"]
                menu_items_lookup = rec_data["menu_items_lookup"]
                for categories in restaurant["menu_categories"] :
                    for item in categories["items"] :
                        for accepted_item in accepted_items :
                            item_name = item["name"]
                            if accepted_item.lower() not in item_name.lower() :
                                continue
                            menu_lookup_query = menu_items_lookup.get(accepted_item) or accepted_item
                            menu_lookup_query = menu_lookup_query.strip()
                            if menu_lookup_query in nonduplicate_recipes :
                                break
                            nonduplicate_recipes.add(menu_lookup_query)
                            recipe_orm = db.session.query(Recipe).filter_by(dish_name=menu_lookup_query).all()
                            if recipe_orm :
                                for r in recipe_orm :
                                    new_rest.recipes.append(r)
        
        # link Recipes --> Cultures
        for recipe in new_rest.recipes:
            for culture in new_rest.cultures:
                if culture not in recipe.cultures:
                    recipe.cultures.append(culture)

        db.session.add(new_rest)
        rest_id += 1

def populate_cultures() :
    print("Starting populate_cultures()...")
    with open(CULTURE_JSON) as f:
        data = json.load(f)
        push_cultures(data)
    db.session.commit()
    print("Cultures added!")

def push_cultures(data) :
    for culture in data["cultures"] :
        entry = dict()
        entry["name"] = culture["name"]
        entry["capital"] = culture["capital"]
        entry["subregion"] = culture["subregion"]
        entry["region"] = culture["region"]
        entry["population"] = culture["population"]
        entry["latlng"] = culture["latlng"] # this may or may not work
        entry["demonym"] = culture["demonym"]
        entry["flag_url"] = culture["flags"]["png"]
        entry["currency"] = culture["currencies"][0]["name"] # maybe
        entry["languages"] = [language_dict["name"] for language_dict in culture["languages"]] # culture["languages"][0]["name"]
        entry["independent"] = culture["independent"]
        entry["summary"] = culture["wikipedia_summary"]
        culture_db_instance = Culture(**entry)
        db.session.add(culture_db_instance)

def populate_recipes() :
    print("Starting populate_recipes()...")
    with open(RECIPE_JSON) as f:
        data = json.load(f)
        push_recipes(data)
    db.session.commit()
    print("Recipes added!")

def push_recipes(data) :
    LABELS = ["Vegetarian", "Vegan", "Gluten Free", "Dairy Free", "Very Healthy", "Cheap", "Very Popular", "Sustainable"]
    DISH_TYPES = ["Breakfast", "Lunch", "Dinner", "Appetizer"]

    recipe_id = 0
    for recipe in data["recipes"]:
        # Get applicable recipe labels
        labels = [lab for lab in LABELS if recipe.get((lab[0].lower() + lab[1:]).replace(" ", ""))] # Lowercase first letter & remove spaces to get label key

        # Get ingredients, format into array of strings
        ingredients = []
        for ingredient in recipe["nutrition"]["ingredients"]:
            if ingredient["unit"] != "":
                ingredients.append(str(ingredient["amount"]) + ' ' + ingredient["unit"] + ' ' + ingredient["name"])
            else:
                ingredients.append(str(ingredient["amount"]) + ' ' + ingredient["name"]) # no recipe unit :(

        # Get instructions, format into array of strings
        instructions = [inst["step"] for inst in recipe["analyzedInstructions"][0]["steps"]]

        # Get dish types, format into array of strings
        dish_types = [t for t in DISH_TYPES if t.lower() in recipe["dishTypes"]]

        new_recipe = Recipe(
            id = recipe_id,
            name = recipe.get("title"),
            summary = recipe.get("summary"),
            image_url = recipe.get("image"),
            source_url = recipe.get("sourceUrl"),
            ready_in_minutes = recipe.get("readyInMinutes"),
            servings = recipe.get("servings"),
            labels = labels,
            ingredients = ingredients,
            total_nutrients = recipe.get("nutrition").get("nutrients"),
            instructions = instructions,
            dish_types = dish_types,
            cuisine_type = recipe.get("cuisines"),
            dish_name = recipe.get("dish_name")
        )
        db.session.add(new_recipe)
        recipe_id += 1

def reset_db():
    # Be VERYYY careful with this...
    db.session.remove()
    db.drop_all()
    db.create_all()
    print("Database reset")


if __name__ == '__main__':    
    print("Initiating db_push()...")
    reset_db()
    populate_cultures()
    populate_recipes()
    populate_restaurants()
    print("db_push() completed!")

