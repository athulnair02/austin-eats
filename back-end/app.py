from models import Culture, Restaurant, Recipe, db, app, culture_schema, culture_schema_basic, restaurant_schema, restaurant_schema_basic, recipe_schema, recipe_schema_basic #, schemas
from flask import Flask, make_response, jsonify, request
from geopy import distance
from datetime import date
from zoneinfo import ZoneInfo
from collections import Counter
from format import *
import requests
import json
import math, operator
import re
import datetime, time
from sqlalchemy import or_, func, case

# TexasVotes code helped a lot with this

# simple float validity check
def isfloat(num):
    try:
        float(num)
        return True
    except ValueError:
        return False

# calculates the coordinates from the restaurant and inserts a distance field to work with the schema
def caulcate_distance(user_loc: str, max_distance, model, relations):
    filtered_relations = relations
    if (model is Restaurant and isinstance(user_loc, str)):
        lat, lon = user_loc.split(',')
        lat = lat.strip()
        lon = lon.strip()
        if isfloat(lat) and isfloat(lon):
            if max_distance and isfloat(max_distance):
                filtered_relations = []
                max_distance = float(max_distance)
            for relation in relations:
                from_loc = (float(lat), float(lon))
                to_loc = (relation.latlng[0], relation.latlng[1])
                miles = distance.distance(from_loc, to_loc).miles
                relation.distance = round(miles, 1)

                # filter by max_distance
                if max_distance and relation.distance <= max_distance:
                    filtered_relations.append(relation)
    return filtered_relations

# calculates whether the Restaurant is open now or not
def calculate_open_status(filter_open_now, model, relations):
    filtered_relations = relations
    if model is Restaurant:
        now = datetime.datetime.now(ZoneInfo("America/Chicago"))
        weekday = now.weekday()
        filter_open_now = filter_open_now.lower() == "true" if filter_open_now else None
        if filter_open_now:
            filtered_relations = []
        for relation in relations:
            relation.open_now = False
            for time_data in relation.hours:
                if time_data.get("day") != weekday:
                    continue
                start_hour = time_data.get("start")
                end_hour = time_data.get("end")

                start_time = now.replace(hour = int(start_hour[:2]), minute = int(start_hour[3:]))
                end_time = now.replace(hour = int(end_hour[:2]), minute = int(end_hour[3:]))
                if time_data.get("is_overnight"):
                    end_time = end_time.replace(day = now.day+1)
                
                if start_time < now < end_time:
                    relation.open_now = True
                    if filter_open_now:
                        filtered_relations.append(relation)
                break
    return filtered_relations

# dump to schema, adding any extra fields that should be added prior to returning
def schema_dump(model, schema, args, data, dump_as_list: bool):
    relations = data.get("relations") if isinstance(data, dict) else data

    # calculate distance from restaurant
    relations = caulcate_distance(args.get("user_loc"), args.get("max_distance"), model, relations)
    # calculate whether the restaurant is open now
    relations = calculate_open_status(args.get("open_now"), model, relations)

    # dump into schema
    all_instances = []
    if dump_as_list is True:
        data["relations"] = [schema.dump(relation) for relation in relations]
        all_instances = data
    else:
        all_instances = schema.dump(relations[0])
    return json.dumps(all_instances)
        
# Filters the specified query with the given args
# Checks each args existence in the model, and performs a chain-filter
def filter_query(query, model, args):
    print(args)
    arg_operations = [("_LT", operator.lt), ("_LE", operator.le), ("_GT", operator.gt), ("_GE", operator.ge), ("_PRT", None)]
    for arg in args:
        values_list = args.getlist(arg)

        # check for optional operation string
        operation = None
        operation_name = None
        for op_str, op in arg_operations:
            if arg.endswith(op_str):
                arg = arg.replace(op_str, "")
                operation = op
                operation_name = op_str
                break
        
        # ensure requested arg filter is a valid attribute
        if hasattr(model, arg):
            column = getattr(model, arg)
            if column.type.python_type == int or column.type.python_type == float:
                # filter int, float by operation
                conditions = []
                for filter_val in values_list:
                    if filter_val.isnumeric():
                        conditions.append(operation(column, filter_val) if operation else column == filter_val)
                query = query.filter(
                    or_(*conditions)
                )
            elif column.type.python_type == bool:
                # filter by simple bool equality
                query = query.filter(column == (values_list[0].lower() == "true"))
            elif column.type.python_type == str:
                # filter by string equality
                if operation_name == "_PRT":
                    # CASE-INSENSITIVE, partial match of any in list
                    conditions = []
                    for value in values_list:
                        conditions.append(func.lower(column).ilike('%{0}%'.format(value)))
                    query = query.filter(
                        or_(*conditions)
                    )
                else:
                    # CASE-SENSITIVE, exact match
                    query = query.filter(column.in_(values_list))
            elif column.type.python_type == list:
                # filter by containing in list
                if operation_name == "_PRT":
                    # CASE-INSENSITIVE, partial match of any in list for FIRST element of query list
                    relations = [relation for relation in query.all()]
                    relation_ids = []
                    lower_value = values_list[0].lower()
                    for relation in relations:
                        lower_relation_list = [v.lower() for v in getattr(relation, arg)]
                        for list_item in lower_relation_list:
                            if lower_value in list_item:
                                relation_ids.append(relation.id)
                    
                    query = query.filter(model.id.in_(relation_ids))
                else:
                    # CASE-SENSITIVE, exact match
                    query = query.filter(column.contains(values_list))
    return query #.filter(model.price.in_(['$', '$$']))


def search_query(query, model, args):
    if not args:
       return query
    terms = args.get("search").split()

    # match the term to the name
    matched_ids = []
    matched_relations = query.filter(func.lower(model.name).ilike('%{0}%'.format(terms[0].lower())))
    for relation in matched_relations:
        matched_ids.append(relation.id)
    for num in range(1, len(terms)):
        term = terms[num]
        term_matches = query.filter(func.lower(model.name).ilike('%{0}%'.format(term.lower())))
        for relation in term_matches:
            matched_ids.append(relation.id)
        matched_relations = matched_relations.union_all(term_matches)
    
    # contains ids in descending frequency order (contains duplicates)
    sorted_ids_dup = [n for n,count in Counter(matched_ids).most_common() for i in range(count)]
    # contains ids in descending frequency order (no duplicates)
    sorted_ids = []
    for sorted_id in sorted_ids_dup:
        if sorted_id not in sorted_ids:
            sorted_ids.append(sorted_id)
    # ordering rule how to sort
    id_ordering = case({_id: index for index, _id in enumerate(sorted_ids_dup)}, value=model.id)
    return query.filter(model.id.in_(sorted_ids)).order_by(id_ordering)


# Queries all on models with pagination, filtering support
def query_all(model, schema, args):
    relations = filter_query(db.session.query(model), model, args)
    relations = search_query(relations, model, args)

    # arg handling
    page_req = args.get("page", default = -1, type = int)
    per_page_req = args.get("per_page", default = 25, type = int)

    data = {}
    if page_req > 0:
        # retrieve paginated instances
        pagination_data = relations.paginate(page = page_req, per_page = per_page_req)
        data["current_page"] = pagination_data.page
        data["num_pages"] = pagination_data.pages
        data["relations"] = pagination_data.items
    else:
        # retrieve all instances
        data["relations"] = relations.all()
    
    return schema_dump(model, schema, args, data, dump_as_list=True)

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
