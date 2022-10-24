from models import Culture, Restaurant, Recipe, db, app #, schemas
from flask import Flask, make_response, jsonify
from format import *
import requests
import json

# TexasVotes code helped a lot with this

@app.route('/api/restaurants', methods=['GET'])
def restaurants() :
    return "Restaurants"

@app.route('/api/restaurants/<int:id>', methods=['GET'])
def restaurants_id(id) :
    return "Restaurants_" + str(id)

@app.route('/api/recipes', methods=['GET'])
def recipes() :
    return "Recipes"

@app.route('/api/recipes/<int:id>', methods=['GET'])
def recipes_id(id) :
    return "Recipes_" + str(id)

@app.route('/api/cultures', methods=['GET'])
def cultures() :
    return "Cultures"

@app.route('/api/cultures/<int:id>', methods=['GET'])
def cultures_id(id) :
    return "Cultures_" + str(id)

@app.route('/api')
def hello_world() :
    return "Hello World!"

if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5000, debug = True)
