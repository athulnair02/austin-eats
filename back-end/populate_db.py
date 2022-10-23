# populating the database from the json data
import json
# import sqlalchemy
# from sqlalchemy import create_engine

def populate_restaurants():
    # engine = create_engine('postgresql://AustinEats:hungryforaustinfood2022@austineats-db.cyocgz8iqxu8.us-east-1.rds.amazonaws.com:5432/postgres')
    # postgresql://FindFootprints:hungryforaustinfood2022@austineats-db.clqa8u8x0xmi.us-east-2.rds.amazonaws.com:5432/postgres
    # austineats-db.clqa8u8x0xmi.us-east-2.rds.amazonaws.com
    # Session = sessionmaker(bind=engine)
    # session = Session()
    with open('./api/ScrapeJSONs/Restaurants.json') as f:
        data = json.load(f)
    rest_id = 0
    for restaurant in data:
        yelp_data = restaurant.get("yelp_data").get("restaurant")
        all_categories = []
        for cat in yelp_data.get("categories"):
            all_categories.append(cat.get("title"))
        new_rest = Restaurant(
        id = rest_id,
        name = yelp_data.get("name"),
        image_url = yelp_data.get("image_url"),
        restaurant_url = yelp_data.get("url"),
        display_phone = yelp_data.get("display_phone"),
        categories = all_categories,
        rating = yelp_data.get("rating"),
        review_count = yelp_data.get("review_count"),
        display_address = restaurant.get("address").get("place_formatted_address"),
        latlng = [restaurant.get("address").get("latitude"), restaurant.get("address").get("longitude")],
        photos = yelp_data.get("photos"),
        price = yelp_data.get("price"),
        delivery = restaurant.get("is_delivery_available"),
        is_open = yelp_data.get("hours")[0].get("is_open_now"))
        session.add(new_rest)
        rest_id = rest_id + 1



# def populate_recipes():

# def populate_cultures():

# for testing purposes
if __name__ == '__main__':
    populate_restaurants()