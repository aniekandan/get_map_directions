let serverOrigin = "http://127.0.0.1:5000"

export function requestLocations(catID, catName, useLocationData, locationDropDown){
    // Send the catID and catName to the Flask backend
    let fetchResult = fetch(`${serverOrigin}/locations`,
                            {
                              method: 'POST',
                              headers: {'Content-Type': 'application/json'},
                              body: JSON.stringify({
                                        id: catID,
                                        name: catName
                                    })
                            }
                          );

    fetchResult.then(
        (response)=>response.json()

    ).then((data)=>{
        // use the returned data to load locations
        useLocationData(data, locationDropDown);

    }).catch((err)=>{
        console.log(err);

    });

}

export function requestCategories(useCategoryData, categoryDropDown, locationDropDown){
    // request the categories
    let fetchResult = fetch(`${serverOrigin}/categories`);

    // initilize document with response data
    fetchResult.then(
        (response)=>response.json()
    
    ).then((data)=>{
        // use the returned data to load categories and locations           
        useCategoryData(data, categoryDropDown, locationDropDown);

    }).catch((err)=>{
        console.log(err);

    });

}

export function requestMapData(useMapData){
    // request the geojson files for the map
    let fetchResult = fetch(`${serverOrigin}/map_data`);

    // initilize document with response data
    fetchResult.then(
        (response)=>response.json()
    
    ).then((data)=>{
        // use the returned data to render the map
        useMapData(data);

    }).catch((err)=>{
        console.log(err);

    });
}
