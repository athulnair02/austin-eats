from app import db
import json
from models import Restaurant, Culture, Recipe

def populate_restaurants() :
    return -1

def push_restaurants() :
    return -1

def populate_cultures() :
    print("Starting populate_cultures()...")
    with open('./api/ScrapeJSONs/Cultures.json') as f:
        data = json.load(f)
        push_cultures(data)
    print("Cultures added!")

def push_cultures(data) :
    for culture in data["cultures"] :
        entry = dict()
        entry["name"] = culture["name"]
        # ... continue for each attribute
        
        # culture_db_instance = Culture(**entry)
        # db.session.add(culture_db_instance)
    # db.session.commit()

def populate_recipes() :
    return -1

def push_recipes(data) :
    return -1

if __name__ == '__main__':
    populate_cultures()
    print(db.get_engine())

