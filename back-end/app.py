from flask import Flask
from models import (Culture, Recipe, Restaurant, join_culture_recipe, join_culture_restaurant, db, app)


@app.route('/cultures', methods=["GET"])
def getCultures():
    pass

@app.route('/cultures/id=<id>', methods=["GET"])
def getCulture_id(id):
    culture = db.session.query(Culture).filter_by(id=id)


@app.route('/recipes', methods=["GET"])
def getRecipes():
    pass

@app.route('/recipes/id=<id>', methods=["GET"])
def getRecipe_id(id):
    recipe = db.session.query(Recipe).filter_by(id=id)


@app.route('/restaurants', methods=["GET"])
def getRestaurants():
    pass

@app.route('/restaurants/id=<id>', methods=["GET"])
def getRestaurant_id(id):
    restaurant = db.session.query(Restaurant).filter_by(id=id)

@app.route('/', methods=["GET"])
def test():
    return {'test' : 'test'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)