from models import Culture, Restaurant, Recipe, db, app, culture_schema, restaurant_schema, recipe_schema #, schemas
from flask import Flask, make_response, jsonify
from format import *
import requests
import json

# TexasVotes code helped a lot with this

@app.route('/api/restaurants', methods=['GET'])
def restaurants() :
    relations = db.session.query(Restaurant).all()
    all_restaurants = [restaurant_schema.dump(relation) for relation in relations]
    return json.dumps(all_restaurants)

@app.route('/api/restaurants/<int:id>', methods=['GET'])
def restaurants_id(id) :
    relation = db.session.query(Restaurant).get(id)
    return json.dumps(restaurant_schema.dump(relation))

@app.route('/api/recipes', methods=['GET'])
def recipes() :
    relations = db.session.query(Recipe).all()
    all_recipes = [recipe_schema.dump(relation) for relation in relations]
    return json.dumps(all_recipes)

@app.route('/api/recipes/<int:id>', methods=['GET'])
def recipes_id(id) :
    relation = db.session.query(Recipe).get(id)
    return json.dumps(recipe_schema.dump(relation))

@app.route('/api/cultures', methods=['GET'])
def cultures() :
    relations = db.session.query(Culture).all()
    all_cultures = [culture_schema.dump(relation) for relation in relations]
    return json.dumps(all_cultures)

@app.route('/api/cultures/<int:id>', methods=['GET'])
def cultures_id(id) :
    relation = db.session.query(Culture).get(id)
    return json.dumps(culture_schema.dump(relation))

@app.route('/api')
def hello_world() :
    return "snoopin' around are we?"

if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5000, debug = True)
