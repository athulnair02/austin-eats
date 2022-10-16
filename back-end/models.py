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
    # fill out rest of culture attributes here

    def __repr__(self):
        return "<Culture %s>" % self.name


class Restaurant(db.Model) :
    __tablename__ = 'restaurants'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())

    def __repr__(self):
        return "<Restaurant %s>" % self.name


class Recipe(db.Model) :
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())

    def __repr__(self):
        return "<Recipe %s>" % self.name
