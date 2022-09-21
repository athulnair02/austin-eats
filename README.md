**Canvas/Discord Group Number:** 10-3

**Names of the team members:** Athul Gopakumar Nair, Christian Camp, Clint Camp, Mihika Birmiwal, Thomas Moore

**Name of the project:** austineats.me

**URL of the GitLab repo:** https://gitlab.com/mihikabirmiwal/cs373-idb

**The proposed project:** A reference webpage to local Austin restaurants that displays statistics for restaurants in the city, recipes for menu items which you can try on your own, and types of cuisines in Austin. There will be an emphasis placed on supporting local businesses, connecting popular menu items to recipes which you can try for yourself, and being able to try similar dishes across different cuisines.

**URLs of at least three disparate data sources:**
- Restaurants, ratings, reviews, menu items: https://www.yelp.com/developers/documentation/v3/get_started
- Recipes and nutrition: https://rapidapi.com/spoonacular/api/recipe-food-nutrition
- Restaurant, culture locations: https://developers.google.com/maps
- Culture: https://restcountries.com/#rest-countries

**Three models:** Restaurants, Recipes, Cuisines/Cultures

**An estimate of the number of instances for each model:**
- Restaurants: 150+
- Recipes: 300+
- Cultures: 50+

**Data model attributes (to sort by):**
- Restaurants: alphabetic, star rating, which meal (breakfast, lunch, dinner), hours open, location, takeout/delivery allowed, culture of origin, review count, price $ - $\$\$\$
- Recipes: alphabetic, cooking difficulty, time to cook, culture of origin, nutrition (healthy vs. not), price $ - $\$\$\$ which meal, spice levels
- Cultures: alphabetic, continent, country, language

**Data model attributes (per instance):**
- Restaurants: photos of the restaurant, location, Yelp reviews/ratings, links to menu/website, description, culture, year opened, hours open
- Recipes: photos of the recipe, ingredient lists, instructions, difficulty, cook time, recipe source, similar recipes
- Cultures: location on map, flag (if part of country), photo of region on map or landscapes (if regional), sample recipes (famous dishes), sample restaurants, historical facts

**Data model connections:**
- Restaurants:
    - ⟶ Recipes: Restaurants have menu items: can link menu items to recipes for people to try at home.
    - ⟶ Cultures: Restaurants often focus on a particular cuisine: can link to information about the cuisine, where a dish originates from.
- Recipes:
    - ⟶ Restaurants: Find a local restaurant that has a version of the recipe on their menu so that you can try it.
    - ⟶ Cultures: Find similar recipes within a culture, or similar recipes between cultures.
- Cultures:
    - ⟶ Restaurants: Search for a restaurant that focuses or serves a type of cuisine.
    - ⟶ Recipes: Search for recipes from a certain cuisine, or compare cultures based on similar recipes.

**Media for each model:**
- Restaurants: photos of the restaurant, photos of the menu items, location of the restaurant on the map, a description, Yelp reviews, link to website
- Recipes: photos of the finished recipes, links to the recipe source, recipe tutorial videos, instructions, Twitter feed of hashtags for the recipe
- Cultures: location on map, photos of the region, culture description, videos/documentaries on the culture, any historical references to the culture/cuisine

**What 3+ questions can be answered with this site?** 
- What local Austin restaurants can I support?
- Which cuisines do Austinites prefer eating out at?
- How are different cuisines spread out around Austin? 
- How can I cook the meals which I enjoy eating at restaurants?