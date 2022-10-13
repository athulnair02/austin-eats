from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
# app.config.from_object(os.environ['APP_SETTINGS'])
# app.config["SQLALCHEMY_DATABASE_URI"] = ""
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

join_culture_restaurant = db.Table(
    "join_culture_restaurant",
    db.Column(
        "culture_id", db.Integer, db.ForeignKey("cultures.id"), primary_key=True
    ),
    db.Column(
        "restaurant_id", db.Integer, db.ForeignKey("restaurants.id"), primary_key=True
    ),
)

join_culture_recipe = db.Table(
    "join_culture_recipe",
    db.Column(
        "culture_id", db.Integer, db.ForeignKey("cultures.id"), primary_key=True
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


class Restaurant(db.Model) :
    __tablename__ = 'restaurants'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())


class Recipe(db.Model) :
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
