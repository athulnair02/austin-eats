from flask import Flask
from db import init_db
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from marshmallow import fields, Schema
from sqlalchemy.dialects.postgresql import ARRAY

# TexasVotes code helped a lot with this

app = Flask(__name__)
CORS(app)
db = init_db(app)
ma = Marshmallow(app)

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

# Association table between cultures and restaurants; many to many relationship
join_restaurant_culture = db.Table(
    "join_culture_restaurant",
    db.Column(
        "restaurant_id", db.Integer, db.ForeignKey("restaurants.id"), primary_key=True
    ),
    db.Column(
        "culture_id", db.Integer, db.ForeignKey("cultures.id"), primary_key=True
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

    # variables
    name = db.Column(db.String())
    capital = db.Column(db.String())
    flag_url = db.Column(db.String())
    currency = db.Column(db.String())
    languages = db.Column(ARRAY(db.String()))
    subregion = db.Column(db.String())
    region = db.Column(db.String())
    population = db.Column(db.Integer)
    latlng = db.Column(ARRAY(db.Float))
    demonym = db.Column(db.String())
    independent = db.Column(db.Boolean)
    summary = db.Column(db.String())

    def __repr__(self):
        return "<Culture %s>" % self.name

class Restaurant(db.Model) :
    __tablename__ = 'restaurants'
    id = db.Column(db.Integer, primary_key=True)
    # associations
    cultures = db.relationship(
        "Culture",
        secondary = join_restaurant_culture,
        backref = db.backref("restaurants", lazy="dynamic")
    )

    recipes = db.relationship(
        "Recipe",
        secondary = join_restaurant_recipe,
        backref = db.backref("restaurants", lazy="dynamic")
    )

    # variables
    name = db.Column(db.String)
    image_url = db.Column(db.String)
    restaurant_url = db.Column(db.String)
    display_phone = db.Column(db.String)
    categories = db.Column(ARRAY(db.String()))
    rating = db.Column(db.Integer)
    review_count = db.Column(db.Integer)
    display_address = db.Column(db.String)
    latlng = db.Column(ARRAY(db.Float()))
    photos = db.Column(ARRAY(db.String()))
    price = db.Column(db.String)
    delivery = db.Column(db.Boolean)
    is_open = db.Column(db.Boolean)
    reviews = db.Column(db.JSON)

    def __repr__(self):
        return "<Restaurant %s>" % self.name

class Recipe(db.Model) :
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)

    # associations
    cultures = db.relationship(
        "Culture",
        secondary = join_culture_recipe,
        backref = db.backref("recipes", lazy="dynamic")
    )

    # variables
    name = db.Column(db.String())
    summary = db.Column(db.String())
    image_url = db.Column(db.String())
    source_url = db.Column(db.String())
    ready_in_minutes = db.Column(db.Integer)
    # TODO: instructions_minutes = db.Column(db.Integer)
    servings = db.Column(db.Integer)
    labels = db.Column(ARRAY(db.String())) # Vegan, Vegetarian, etc
    ingredients = db.Column(ARRAY(db.String()))
    total_nutrients = db.Column(db.JSON) # Macros, Calories, etc         # db.relationship("Nutrient") # One-Many relationship between recipe & nutrients
    instructions = db.Column(ARRAY(db.String()))
    dish_types = db.Column(ARRAY(db.String())) # Breakfast, Lunch, Dinner, etc
    cuisine_type = db.Column(ARRAY(db.String())) # American, Chinese, etc
    # TODO: health_score = db.Column(db.Integer)
    dish_name = db.Column(db.String) # Taco, Salad, etc

    def __repr__(self):
        return "<Recipe %s>" % self.name

# Nutrients for recipes (MIGHT NOT BE NEEDED if db.JSON type works as expected)
"""class Nutrient(db.Model) :
    __tablename__ = 'nutrients'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"))"""


class CultureSchema(Schema) :
    id = fields.Integer(required=True)
    name = fields.String(required=True)

    restaurants = fields.Nested("RestaurantSchema", only=("id", "name", "image_url", "rating", "review_count", "price"), required=True, attribute="restaurants", many=True)
    recipes = fields.Nested("RecipeSchema", only=("id", "name", "image_url", "ingredients", "dish_types", "ready_in_minutes", "cuisine_type"), required=True, attribute="recipes", many=True)

    capital = fields.String(required=True)
    flag_url = fields.String(required=True)
    currency = fields.String(required=True)
    languages = fields.List(fields.String(), required=True)
    subregion = fields.String(required=True)
    region = fields.String(required=True)
    population = fields.Integer(required=True)
    latlng = fields.List(fields.Integer(), required=True)
    demonym = fields.String(required=True)
    independent = fields.Boolean(required=True)
    summary = fields.String(required=True)

# may need to adjust this MenuSchema
class MenuSchema(Schema) :
    id = fields.Integer(required=True)
    dishes = fields.List(fields.String(), required=True)

class RestaurantSchema(Schema) :
    id = fields.Integer(required=True)
    name = fields.String(required=True)

    dishes = fields.Pluck(MenuSchema, "dishes", many=True)
    cultures = fields.Nested("CultureSchema", only=("id", "name", "demonym", "region", "subregion", "population", "flag_url", "independent"), required=True, attribute="cultures", many=True)
    # not sure how to link recipes to the dishes; we will see!
    recipes = fields.Nested("RecipeSchema", only=("id", "name", "image_url", "ingredients", "dish_types", "ready_in_minutes", "cuisine_type"), required=True, attribute="recipes", many=True)

    image_url = fields.String(required=False)
    restaurant_url = fields.String(required=False)
    display_phone = fields.String(required=True)
    categories = fields.List(fields.String(), required=True) #fields.List(fields.Dict(keys=fields.String(), values=fields.String(), required=True), required=True)
    rating = fields.Integer(required=True)
    review_count = fields.Integer(required=True)
    display_address = fields.String(required=True)
    latlng = fields.List(fields.Float(), required=True) #fields.Dict(keys=fields.String(), values=fields.Integer(), required=True)
    distance = fields.Float()
    photos = fields.List(fields.String(), required=True)
    price = fields.String(required=True)
    # takeout, delivery
    delivery = fields.Bool(required=True)

class RecipeSchema(Schema) :
    id = fields.Integer(required=True)
    name = fields.String(required=True)

    restaurants = fields.Nested("RestaurantSchema", only=("id", "name", "image_url", "rating", "review_count", "price"), required=True, attribute="restaurants", many=True)
    cultures = fields.Nested("CultureSchema", only=("id", "name", "demonym", "region", "subregion", "population", "flag_url", "independent"), required=True, attribute="cultures", many=True)

    summary = fields.String(required=True)
    image_url = fields.String(required=True)
    source_url = fields.String(required=True)
    ready_in_minutes = fields.Integer(required=True)
    # TODO: instructions_minutes = fields.Integer(required=True)
    servings = fields.Integer(required=True)
    # low-fat, etc
    diet_labels = fields.List(fields.String(), required=True)
    ingredients = fields.List(fields.String(), required=True) #fields.List(fields.Dict(keys=fields.String(), values=fields.String(), required=True), required=True)
    total_nutrients = fields.List(fields.Dict(keys=fields.String(), values=fields.String(), required=True), required=True)
    instructions = fields.List(fields.String(), required=True)
    cuisine_type = fields.List(fields.String(), required=True)
    # TODO: health_score = fields.Integer(required=True)
    # b, l, d
    dish_types = fields.List(fields.String(), required=True)
    dish_name = fields.String(required=True)

culture_schema = CultureSchema()
culture_schema_basic = CultureSchema(exclude=['restaurants', 'recipes'])
restaurant_schema = RestaurantSchema()
restaurant_schema_basic = RestaurantSchema(exclude=['cultures', 'recipes'])
recipe_schema = RecipeSchema()
recipe_schema_basic = RecipeSchema(exclude=['restaurants', 'cultures'])
