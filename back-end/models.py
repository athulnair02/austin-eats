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

class CultureSchema() :
    id = fields.Integer(required=True)
    name = fields.String(required=True)

    restaurants = fields.Nested("RestaurantSchema", only=("id", "name", "image", "rating", "review_count", "price"), required=True, attribute="restaurants", many=True)
    recipes = fields.Nested("RecipeSchema", only=("id", "name", "summary", "meal_type", "dish_type", "ready_in_minutes", "servings"), required=True, attribute="recipes", many=True)

    capital = fields.String(required=True)
    flags = fields.List(fields.String(), required=True)
    currencies = fields.Dict(keys=fields.String(), values=fields.String(), required=True)
    languages = fields.Dict(keys=fields.String(), values=fields.String(), required=True)
    subregion = fields.String(required=True)
    region = fields.String(required=True)
    population = fields.Integer(required=True)
    latlng = fields.List(fields.Integer(), required=True)
    demonym = fields.String(required=True)
    independent = fields.Boolean(required=True)
    summary = fields.String(required=True)

# may need to adjust this MenuSchema
class MenuSchema() :
    id = fields.Integer(required=True)
    dishes = fields.List(fields.String(), required=True)

class RestaurantSchema() :
    id = fields.Integer(required=True)
    name = fields.String(required=True)

    dishes = fields.Pluck(MenuSchema, "dishes", many=True)
    cultures = fields.Nested("CultureSchema", only=("id", "name", "demonym", "region"), required=True, attribute="cultures", many=True)
    # not sure how to link recipes to the dishes; we will see!
    recipes = fields.Nested("RecipeSchema", only=("id", "name", "summary", "meal_type", "dish_type", "ready_in_minutes", "servings"), required=True, attribute="recipes", many=True)

    image = fields.String(required=False, attribute="image_url")
    url = fields.String(required=False, attribute="restaurant_url")
    display_phone = fields.String(required=True)
    categories = fields.List(fields.Dict(keys=fields.String(), values=fields.String(), required=True), required=True)
    rating = fields.Integer(required=True)
    review_count = fields.Integer(required=True)
    location = fields.List(fields.String(), required=True, attribute="display_address")
    latlng = fields.Dict(keys=fields.String(), values=fields.Integer(), required=True)
    price = fields.String(required=True)
    # takeout, delivery
    transactions = fields.List(fields.String(), required=True)

class RecipeSchema() :
    id = fields.Integer(required=True)
    name = fields.String(required=True, attribute="label")

    restaurants = fields.Nested("RestaurantSchema", only=("id", "name", "image", "rating", "review_count", "price"), required=True, attribute="restaurants", many=True)
    cultures = fields.Nested("CultureSchema", only=("id", "name", "demonym", "region"), required=True, attribute="cultures", many=True)

    uri = fields.String(required=True, attribute="recipe_uri")
    summary = fields.String(required=True)
    image = fields.String(required=False, attribute="image_url")
    source = fields.String(required=True)
    source_url = fields.String(required=True, attribute="source_url")
    ready_in_minutes = fields.Integer(required=True, attribute="totalTime")
    servings = fields.Integer(required=True, attribute="yield")
    # low-fat, etc
    diet_labels = fields.List(fields.String(), required=True)
    # sugar-free, keto, etc.
    health_labels = fields.List(fields.String(), required=True)
    ingredients = fields.List(fields.Dict(keys=fields.String(), values=fields.String(), required=True), required=True)
    total_nutrients = fields.Dict(keys=fields.String(), values=fields.Dict(), required=True)
    cuisine_type = fields.List(fields.String(), required=True)
    # b/l/d
    meal_type = fields.List(fields.String(), required=True)
    # bread, etc.
    dish_type = fields.List(fields.String(), required=True)
