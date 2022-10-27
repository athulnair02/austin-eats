from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import cast
from sqlalchemy import any_
import models
from sqlalchemy import func, or_, String
import re

#Restaurants
def get_all_restaurants(db: Session):
    return db.query(models.Restaurant).all()

def get_restaurant_by_id(db: Session, restaurant_id):
    restaurant = db.query(models.Restaurant).filter_by(id=restaurant_id).first()
    restaurant = restaurant.__dict__
    return restaurant 


#Recipes
def get_all_recipes(db: Session):
    return db.query(models.Recipe).all()

def get_recipe_by_id(db: Session, recipe_id):
    recipe = db.query(models.Recipe).filter_by(id=recipe_id).first()
    recipe = recipe.__dict__
    return recipe 


#Cultures
def get_all_cultures(db: Session):
    return db.query(models.Culture).all()

def get_culture_by_id(db: Session, culture_id):
    culture = db.query(models.Culture).filter_by(id=culture_id).first()
    culture = culture.__dict__
    return culture 


