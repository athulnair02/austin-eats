from flask_sqlalchemy import SQLAlchemy
import os

# TexasVotes code helped a lot with this

def init_db(app):
    # need to set up AWS DB before we can have the key
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://austineats:hungryforaustinfood2022@austineats-db.clqa8u8x0xmi.us-east-2.rds.amazonaws.com:5432/postgres"  #os.environ.get("AWS_DB_KEY")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    return SQLAlchemy(app)
