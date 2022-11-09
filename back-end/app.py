from models import Culture, Restaurant, Recipe, db, app, culture_schema, culture_schema_basic, restaurant_schema, restaurant_schema_basic, recipe_schema, recipe_schema_basic #, schemas
from flask import Flask, make_response, jsonify, request
from geopy import distance
from format import *
import requests
import json
import math, operator
import re

# TexasVotes code helped a lot with this

# simple float validity check
def isfloat(num):
    try:
        float(num)
        return True
    except ValueError:
        return False

# calculates the coordinates from the restaurant and inserts a distance field to work with the schema
def caulcate_distance(user_loc: str, model, relations):
    if (model is Restaurant and isinstance(user_loc, str)):
        lat, lon = user_loc.split(',')
        lat = lat.strip()
        lon = lon.strip()
        if isfloat(lat) and isfloat(lon):
            for relation in relations:
                from_loc = (float(lat), float(lon))
                to_loc = (relation.latlng[0], relation.latlng[1])
                miles = distance.distance(from_loc, to_loc).miles
                relation.distance = round(miles, 1)

# dump to schema, adding any extra fields that should be added prior to returning
def schema_dump(model, schema, args, relations: list, dump_as_list: bool):
    # calculate distance from restaurant
    user_loc = args.get("user_loc")
    caulcate_distance(user_loc, model, relations)

    # dump into schema
    all_instances = []
    if dump_as_list is True:
        all_instances = [schema.dump(relation) for relation in relations]
    else:
        all_instances = schema.dump(relations[0])
    return json.dumps(all_instances)
        
# Filters the specified query with the given args
# Checks each args existence in the model, and performs a chain-filter
# TODO: to make restaurant filter by price work, must re-load data by making Rating an int instead of a float. float comparison sucks!
def filter_query(query, model, args):
    print(args)
    arg_operations = [("_LT", operator.lt), ("_LE", operator.le), ("_GT", operator.gt), ("_GE", operator.ge)]
    for arg in args:
        values_list = args.getlist(arg)

        # check for optional operation string
        operation = None
        for op_str, op in arg_operations:
            if arg.endswith(op_str):
                arg = arg.replace(op_str, "")
                operation = op
                break
        
        # ensure requested arg filter is a valid attribute
        if hasattr(model, arg):
            column = getattr(model, arg)
            if column.type.python_type == int or column.type.python_type == float:
                # filter int, float by operation
                filter_val = values_list[0]
                if filter_val.isnumeric():
                    query = query.filter(operation(column, filter_val) if operation else column == filter_val)
            elif column.type.python_type == bool:
                # filter by simple bool equality
                query = query.filter(column == (values_list[0].lower() == "true"))
            elif column.type.python_type == str:
                # filter by string equality (CASE-SENSITIVE)
                query = query.filter(column.in_(values_list))
            elif column.type.python_type == list:
                # filter by containing in list (CASE-SENSITIVE)
                query = query.filter(column.contains(values_list))
    return query #.filter(model.price.in_(['$', '$$']))


def search_query(query, model, args):
    if not args:
        return query
    else:
        args = args[0].strip()
    terms = args.split()
    searches_set = set()

    # match the term to the name
    for term in terms:
        if re.search(term.lower(), model.name.lower())
            searches_set.add(model.name)
    
    query = query.join(model).filter(or_(*tuple(searches_set)))
    return query


# Queries all on models with pagination, filtering support
def query_all(model, schema, args):
    relations = filter_query(db.session.query(model), model, args)

    # arg handling
    page_req = args.get("page", default = -1, type = int)
    per_page_req = args.get("per_page", default = 25, type = int)

    if page_req > 0:
        # retrieve paginated instances
        relations = relations.paginate(page = page_req, per_page = per_page_req).items
    else:
        # retrieve all instances
        relations = relations.all()
    
    return schema_dump(model, schema, args, relations, dump_as_list=True)

# Queries from id on models
def query_one(model, schema, id, args):
    relation = db.session.query(model).get(id)
    return schema_dump(model, schema, args, [relation], dump_as_list=False)


@app.route('/api/restaurants', methods=['GET'])
def restaurants() :
    return query_all(Restaurant, restaurant_schema_basic, request.args)

@app.route('/api/restaurants/<int:id>', methods=['GET'])
def restaurants_id(id) :
    return query_one(Restaurant, restaurant_schema, id, request.args)

@app.route('/api/recipes', methods=['GET'])
def recipes() :
    return query_all(Recipe, recipe_schema_basic, request.args)

@app.route('/api/recipes/<int:id>', methods=['GET'])
def recipes_id(id) :
    return query_one(Recipe, recipe_schema, id, request.args)

@app.route('/api/cultures', methods=['GET'])
def cultures() :
    return query_all(Culture, culture_schema_basic, request.args)

@app.route('/api/cultures/<int:id>', methods=['GET'])
def cultures_id(id) :
    return query_one(Culture, culture_schema, id, request.args)

@app.route('/api')
def hello_world() :
    return "snoopin' around are we?"

if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5000, debug = True)
