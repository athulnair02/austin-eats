from models import Culture, Restaurant, Recipe, db, app, culture_schema, culture_schema_basic, restaurant_schema, restaurant_schema_basic, recipe_schema, recipe_schema_basic #, schemas
from flask import Flask, make_response, jsonify, request
# from geopy import distance
from format import *
import requests
import json
import math, operator

# TexasVotes code helped a lot with this

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
                print("operator")
                filter_val = values_list[0]
                if filter_val.isnumeric():
                    query = query.filter(operation(column, filter_val) if operation else column == filter_val)
            elif column.type.python_type == bool:
                # filter by simple bool equality
                print("bool!")
                query = query.filter(column == (values_list[0].lower() == "true"))
            elif column.type.python_type == str:
                # filter by string equality
                query = query.filter(column.in_(values_list))
    return query #.filter(model.price.in_(['$', '$$']))

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
    all_instances = [schema.dump(relation) for relation in relations]
    return json.dumps(all_instances)


@app.route('/api/restaurants', methods=['GET'])
def restaurants() :
    return query_all(Restaurant, restaurant_schema_basic, request.args)

@app.route('/api/restaurants/<int:id>', methods=['GET'])
def restaurants_id(id) :
    relation = db.session.query(Restaurant).get(id)
    return json.dumps(restaurant_schema.dump(relation))

@app.route('/api/recipes', methods=['GET'])
def recipes() :
    return query_all(Recipe, recipe_schema_basic, request.args)

@app.route('/api/recipes/<int:id>', methods=['GET'])
def recipes_id(id) :
    relation = db.session.query(Recipe).get(id)
    return json.dumps(recipe_schema.dump(relation))

@app.route('/api/cultures', methods=['GET'])
def cultures() :
    return query_all(Culture, culture_schema_basic, request.args)

@app.route('/api/cultures/<int:id>', methods=['GET'])
def cultures_id(id) :
    relation = db.session.query(Culture).get(id)
    return json.dumps(culture_schema.dump(relation))

@app.route('/api')
def hello_world() :
    newport_ri = (41.49008, -71.312796)
    cleveland_oh = (41.499498, -81.695391)
    print(distance.distance(newport_ri, cleveland_oh).miles)
    return "snoopin' around are we?"

if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5000, debug = True)
