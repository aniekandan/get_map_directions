from geo_app import app
from . import utils as ut
from flask import request, render_template, jsonify, make_response
import geopandas as gpd
import pandas as pd
import requests
import os
import json
from flask_cors import CORS, cross_origin

'''
    Set Cross-Origin here
'''

CORS(app, resources={r"/*":{"origins":"*"}}, supports_credentials=True)

'''
Use the after_request decorator to set Access-Control-Allow
'''
@app.after_request
def after_request(response):
    response.headers.add(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization')
    response.headers.add(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS')
    return response


'''
    Render the home page here
'''
@app.route('/')
@cross_origin()
def index():
    # Render the Jinja2 template
    return render_template('index.html')


'''
    The API endpoints go here
'''

# get all geojson files
geojson_files = ut.get_geojsonDS()

@app.route('/map_data')
@cross_origin()
def get_map_data():
    '''
        Return geojson info for rendering on the UI
    '''

    # get the geojson data to be rendered on the map
    geojson_data = []
    for file in geojson_files:
        with open(f"{ut.path}/mapData/{file}", 'r') as fr:
            geojson_data.append(json.load(fr))

    geojson_data = [
        {
            "name": geojson_files[i],
            "data": geojson_data[i]
        }
        for i in range(len(geojson_files))
        if not(geojson_files[i]=="uniuyo contour.geojson")
    ]

    # construct and return the response
    response = {
        "geojsonData": geojson_data

    }

    return make_response(jsonify(response), 200)



@app.route('/categories')
@cross_origin()
def get_categories():
    '''
        Return all the categories in all geojson files
    '''

    # get the category names. The category names will be used to 
    # filter and categorize the locations on the UI
    ut.load_category_names(geojson_files)

    # construct and return the response
    response = {
        "categories": ut.category_names

    }

    print(response)

    return make_response(jsonify(response), 200)


@app.route('/locations', methods=['POST'])
@cross_origin()
def get_locations():
    '''
        Get all locations by category
    '''

    # get the id from request
    req = request.get_json()
    categoryID = int(req['id'])
    categoryName = req['name']

    # get all the geodataframes and combine them...

    # get geojson files
    geojson_files = ut.get_geojsonDS()

    # map to a path, and filter
    category_file_paths = [
                        f"{ut.path}/mapData/{gjf}"
                        for gjf in geojson_files
                        if not(gjf in ["Minor Roads.geojson", "major_roads.geojson", "uniuyo contour.geojson"])
                    ]

    # read the files into a geodf
    gdf_list = [
                    gpd.read_file(cfpath) 
                    for cfpath in category_file_paths
                ]

    # combine all the data into a single gdf
    combined_gdf = pd.concat(gdf_list)

    # filter out rows having categoryID...

    # get the category name
    category = ut.category_names[categoryID]

    # get the filtered geo data frame
    filtered_df = combined_gdf[combined_gdf['CATERGORY']==category]

    # each location geometry needs a representative coordinate
    geoms = filtered_df['geometry'].values.tolist()
    geoms = [ut.get_repr_coord(geom) for geom in geoms]

    # get the ids, names, and repr coords for the locations
    filtered_rows = filtered_df[['ID', 'NAME']]
    filtered_rows['repCoords'] = geoms
    filtered_rows = filtered_rows.values.tolist()
    filtered_rows = [
                        {"ID": fr[0], "NAME": fr[1], "REP_COORDS": fr[2]} 
                        for fr in filtered_rows
                    ]

    # construct and return the filtered locations
    response = {
        "catergoryID": categoryID,
        "catergoryName": categoryName,
        "items": filtered_rows,
        "count": len(filtered_rows)

    }

    return make_response(jsonify(response), 200)


