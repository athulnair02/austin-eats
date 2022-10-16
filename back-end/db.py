from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

def init_db(app):
    load_dotenv()
    # need to set up AWS DB before we can have the key
    # app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('AWS_DB_KEY')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    return SQLAlchemy(app)
