from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
# app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


if __name__ == '__main__':
    app.run()

@app.route('/cultures', methods=["GET"])
def getCultures():

@app.route('/cultures/id=<id>', methods=["GET"])
def getCulture_id(id):
    culture = db.session.query(Culture).filter_by(id=id)


@app.route('/recipes', methods=["GET"])
def getRecipes():

@app.route('/recipes/id=<id>', methods=["GET"])
def getRecipe_id(id):
    recipe = db.session.query(Recipe).filter_by(id=id)


@app.route('/restaurants', methods=["GET"])
def getRestaurants():

@app.route('/restaurants/id=<id>', methods=["GET"])
def getRestaurant_id(id):
    restaurant = db.session.query(Restaurant).filter_by(id=id)