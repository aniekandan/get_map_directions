import geopandas as gpd
import os
from shapely import Polygon, MultiPolygon
import math

category_names = {}
path = os.path.realpath(os.path.dirname(__file__))

def load_category_names(geojson_files):
    '''
        Load all the unique category names found in all geojson files
        in the CATERORIES column. Load them into the category_names dictionary.
        Each entry has a key (int) for the category serial numbser, and value (str)
        for the category name
    '''
    returnList = []

    # get all the file paths of the geojson files
    category_file_paths = [
                        f"{path}/mapData/{gjf.split('.')[0]}.geojson"
                        for gjf in geojson_files
                        if not(gjf in ["Minor Roads.geojson", "major_roads.geojson", "uniuyo contour.geojson"])
                    ]

    print("category_file_paths", category_file_paths)

    # construct a list of all the categories from all files
    for fn in category_file_paths:
        # load geojson file into a geodataframe
        gdf = gpd.read_file(fn)

        # read the column 'CATEGORY'
        categories = gdf['CATERGORY']

        # convert the categories Series object to a set to 
        # remove all duplicate entries from the CATERGORIES column
        # then convert the result to a list so that it
        # can be merged to the resultList
        returnList += list(set(categories))

    # after all the concatenations done in the for loop, resultList
    # could contain duplicates and None entries. Make the returnList
    # to contain unique entires, and filter out None entries
    returnList = [name for name in list(set(returnList)) if isinstance(name, str)]

    # load the categories in the category_names global dictionary
    global category_names
    category_names = {id:returnList[id]  for id in range(len(returnList))}
    print("category_names", category_names)

def get_geojsonDS():  
    '''
        Get a list of all geojson files for the project
    '''
    folder = f"{path}/mapData"
    folder_contents = os.listdir(folder)
    geojson_files = [fc for fc in folder_contents
                    if (os.path.isfile(f"{folder}/{fc}") 
                        and (fc.endswith(".geojson")))]
    return geojson_files

def get_repr_coord(geom):
    '''
        Gets a single coordinate from a geometry to represent
        the whole geometry object. Expects the following parameters:
            geom :  a Polygon or MultiPolygon object

        returns:
            dict: a dictionsary with the keys 'Latitude' and 'Longitude'
    '''
    if type(geom)== Polygon:
        longArray, latArray = geom.exterior.coords.xy
        bounds = list(zip(list(longArray), list(latArray)))
        long, lat = bounds[0]
        return {"Latitude": lat, "Longitude": long}

    elif type(geom)== MultiPolygon:
        polyg = list(geom.geoms)[0]
        return get_repr_coord(polyg)

    return None