# populating the database from the json data
import json
from pydoc import doc
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# JSON paths
RECIPE_JSON = "./api/ScrapeJSONs/Chownow.json"

def populate_restaurants():
    engine = create_engine('postgresql://FindFootprints:FindThoseFootprints1@findingfootprints-db.cyocgz8iqxu8.us-east-1.rds.amazonaws.com:5432/postgres')
    austineats-db.clqa8u8x0xmi.us-east-2.rds.amazonaws.com
    Session = sessionmaker(bind=engine)
    session = Session()


def populate_recipes():
    # todo: Set up key stuff & db

    with open(RECIPE_JSON) as recipe_json:
        recipe_data = json.load(recipe_json)

        for recipe in recipe_data:
            # todo: Populate data yeaaaa


def populate_cultures():
