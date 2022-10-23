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
        entry["languages"] = culture["languages"][0]["name"] # maybe
        entry["independent"] = culture["independent"]
        entry["summary"] = culture["wikipedia_summary"]
        culture_db_instance = Culture(**entry)
        db.session.add(culture_db_instance)

def populate_recipes() :
    return -1

def push_recipes(data) :
    return -1

def reset_db():
    # Be VERYYY careful with this...
    db.session.remove()
    db.drop_all()
    db.create_all()
    print("Database reset")


if __name__ == '__main__':    
    print("Initiating db_push...")
    reset_db()
    populate_cultures()

