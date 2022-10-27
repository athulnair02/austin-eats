from typing import Generator
import organize
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest

engine = create_engine('postgresql://austineats:hungryforaustinfood2022@austineats-db.clqa8u8x0xmi.us-east-2.rds.amazonaws.com:5432/postgres')
session = sessionmaker(bind=engine)


class TestBackend:
    @pytest.mark.run(order=1)

    def test_get_all_restaurants(self):
        data = organize.get_all_restaurants(session)
        assert isinstance(data, list)
        assert len(data) >= 100

    def test_get_restaurant_by_id(self):
        cables = {
            'name': "Cain and Abel's",
            'image_url': "https://s3-media3.fl.yelpcdn.com/bphoto/lYXoT9OeVD6MNs1E4R1llw/o.jpg",
            'restaurant_url': "https://www.yelp.com/biz/cain-and-abels-austin?adjust_creative=HLIe_i7ytzk0WfjWPTu9uQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=HLIe_i7ytzk0WfjWPTu9uQ",
            'display_phone': "(512) 476-3201",
            'rating': 3.0,
            'review_count' : 125,
            'display_address': "2313 Rio Grande St, Austin, TX 78705",
            'price': "$",
        }
        data = organize.get_restaurant_by_id(session, 0) # confirm id for cables
        assert data 
        for key in cables:
            assert cables[key] == data[key]


    def test_get_all_recipes(self):
        data = organize.get_all_recipes(session)
        assert isinstance(data, list)
        assert len(data) >= 100

    def test_get_recipe_by_id(self):
        chicken_taco = {
            'name': "How to Make a Chicken Taco Crock Pot", 
            'summary': "If you want to add more <b>gluten free and dairy free</b> recipes to your collection, How to Make a Chicken Taco Crock Pot might be a recipe you should try. This recipe makes 4 servings with <b>392 calories</b>, <b>45g of protein</b>, and <b>6g of fat</b> each. For <b>$2.27 per serving</b>, this recipe <b>covers 27%</b> of your daily requirements of vitamins and minerals. If you have canned tomatoes, taco seasoning, corn, and a few other ingredients on hand, you can make it. 1 person has made this recipe and would make it again. This recipe is typical of Mexican cuisine. It is brought to you by Pink When. It works best as a main course, and is done in roughly <b>4 hours and 10 minutes</b>. With a spoonacular <b>score of 0%</b>, this dish is improvable. Users who liked this recipe also liked <a href=\"https://spoonacular.com/recipes/crock-pot-taco-chicken-483776\">Crock-Pot Taco Chicken</a>, <a href=\"https://spoonacular.com/recipes/crock-pot-taco-chicken-113037\">Crock Pot Taco Chicken</a>, and <a href=\"https://spoonacular.com/recipes/crock-pot-chicken-taco-meat-136444\">Crock Pot Chicken Taco Meat</a>.",
            'image_url': "https://spoonacular.com/recipeImages/710765-312x231.jpg",
            'ready_in_minutes': 250,
            'servings': 4,
        }
        data = organize.get_recipe_by_id(session, 0) # confirm id for chicken tacos
        assert data 
        for key in chicken_taco:
            assert chicken_taco[key] == data[key]
   

    def test_get_all_cultures(self):
        data = organize.get_all_cultures(session)
        assert isinstance(data, list)
        assert len(data) >= 100


    def test_get_culture_by_id(self):
        usa = {
            "name":"United States of America",
            "capital":"Washington, D.C.",
            "subregion": "Northern America",
            "region": "Americas",
            "population": 329484123,
        }
        data = organize.get_culture_by_id(session, 0) # confirm that this is the id
        assert data 
        for key in usa:
            assert usa[key] == data[key]