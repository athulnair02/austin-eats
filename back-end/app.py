# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
from init import app
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy import create_engine
# from models import (Company, db, County, Official, Facility, link_companies_fac)
import math



# app = Flask(__name__)
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config('SQLALCHEMY_DATABASE_URI') = 

# db = SQLAlchemy(app)

# class Culture(db.Model):
#     id = db.Column(db.Integer, primary_key=True)

# class Recipe(db.Model):
#     id = db.Column(db.Integer, primary_key=True)

# class Restaurant(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String)
#     # image_url = db.Column()



@app.route("/test")
def test():
    return { 'message': ['test Hello World!', 'hi guys']}

if __name__ == '__main__':
    app.run(debug=True)
