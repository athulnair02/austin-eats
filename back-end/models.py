from flask import Flask, make_response, jsonify
from db import init_db
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from marshmallow import fields, post_dump

app = Flask(__name__)
CORS(app)
db = init_db(app)
ma = Marshmallow(app)

# Association table between cultures and restaurants; many to many relationship
join_culture_restaurant = db.Table(
    "join_culture_restaurant",
    db.Column(
        "culture_id", db.Integer, db.ForeignKey("cultures.id"), primary_key=True
    ),
    db.Column(
        "restaurant_id", db.Integer, db.ForeignKey("restaurants.id"), primary_key=True
    ),
)

# Association table between cultures and recipes; many to many relationship
join_culture_recipe = db.Table(
    "join_culture_recipe",
    db.Column(
        "culture_id", db.Integer, db.ForeignKey("cultures.id"), primary_key=True
    ),
    db.Column(
        "recipe_id", db.Integer, db.ForeignKey("recipes.id"), primary_key=True
    ),
)

# Association table between restaurants and recipes; many to many relationship
join_restaurant_recipe = db.Table(
    "join_restaurant_recipe",
    db.Column(
        "restaurant_id", db.Integer, db.ForeignKey("restaurants.id"), primary_key=True
    ),
    db.Column(
        "recipe_id", db.Integer, db.ForeignKey("recipes.id"), primary_key=True
    ),
)

class Culture(db.Model) :
    __tablename__ = 'cultures'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    capital = db.Column(db.String())
    flags = db.Column(db.BLOB)
    currencies = db.Column(db.PickleType)
    languages = db.Column(db.PickleType)
    subregion = db.Column(db.String())
    region = db.Column(db.String())
    population = db.Column(db.Integer)
    demonym = db.Column(db.String())
    independent = db.Column(db.Boolean)
    summary = db.Column(db.String())

    def __repr__(self):
        return "<Culture %s>" % self.name


class Restaurant(db.Model) :
    __tablename__ = 'restaurants'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    image_url = db.Column(db.String())
    url = db.Column(db.String())
    display_phone = db.Column(db.String())
    rating = db.Column(db.Float)
    review_count = db.Column(db.Integer)
    display_address = db.Column(db.String())
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    photos = db.Column(db.BLOB)
    price = db.Column(db.Integer)
    delivery = db.Column(db.Boolean)
    hours = db.Column(db.String())

    def __repr__(self):
        return "<Restaurant %s>" % self.name


class Recipe(db.Model) :
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    summary = db.Column(db.String())
    image = db.Column(db.BLOB)
    source = db.Column(db.String())
    ready_in_minutes = db.Column(db.Integer)
    servings = db.Column(db.Float)
    labels = db.Column(db.PickleType)
    health_score = db.Column(db.Float)
    ingredients = db.Column(db.PickleType)
    nutrition = db.Column(db.String())
    instructions = db.Column(db.String())
    cuisines = db.Column(db.PickleType)
    dish_types = db.Column(db.PickleType)

    def __repr__(self):
        return "<Recipe %s>" % self.name
