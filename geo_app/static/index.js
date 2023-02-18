import { requestCategories, requestMapData } from './requests.js';
import { reloadLocations, useCategoryData, useMapData } from './response.js';
import { getStartLocation, getEndLocation } from './geolocation.js';
import { canGeolocate, enableGeolocation, disableGeolocation } from './geolocation.js';
import { findRoute } from './mapping.js';

// ------------------- initialize the UI -------------------------------
document.addEventListener('DOMContentLoaded', function(){
    // render map with geojson data
    requestMapData(useMapData);

    // request to load start location categories and locations
    requestCategories(useCategoryData, 
                        document.getElementById("startCategoryList"),
                        document.getElementById("startLocationList"));

    // request to load destination location categories and locations
    requestCategories(useCategoryData, 
                        document.getElementById("destinationCategoryList"),
                        document.getElementById("destinationLocationList"));

    // ------------------- update location list on change category selection -------------------------------
    document.getElementById("startCategoryList").addEventListener('change', function(){
        reloadLocations(document.getElementById("startCategoryList"), 
                        document.getElementById("startLocationList"));

    });

    document.getElementById("destinationCategoryList").addEventListener('change', function(){
        reloadLocations(document.getElementById("destinationCategoryList"), 
                        document.getElementById("destinationLocationList"));
         
    });
    
});


// ------------------- toggle button change event handler --------------------
document.getElementById("switchLocationTracking").addEventListener('change', function(){
    let isChecked = document.getElementById("switchLocationTracking").checked;    
    let deviceLocationContainer = document.getElementById("deviceLocation");
    let customStartLocationContainer = document.getElementById("customStartLocation");

    if(isChecked){
        // first check if geolocation is possible
        // if not possible, notify user, and switch back to 
        // customStartLocation template
        if(canGeolocate()){
            // geolocation possible

            // enable location tracking
            enableGeolocation();

            // show deviceLocation div, and
            // hide customStartLocation div
            deviceLocationContainer.classList.remove("d-none");
            customStartLocationContainer.classList.add("d-none");

        } else {
            // geolocation not possible
            // notify user
            // TODO: Use a bootstrap modal
            alert("Geolocation support unavailable!");

        }        

    } else {
        // disable location tracking
        disableGeolocation();

        // show customStartLocation div, and
        // hide deviceLocation div
        deviceLocationContainer.classList.add("d-none");
        customStartLocationContainer.classList.remove("d-none");

        // request to reload load start location categories and locations
        requestCategories(useCategoryData, 
            document.getElementById("startCategoryList"),
            document.getElementById("startLocationList"));

    }

});


// ------------------- get directions -------------------------------
document.getElementById("get-directions").addEventListener('click', function(e){
    let startCoord = getStartLocation();
    let endCoord = getEndLocation();
    findRoute(startCoord, endCoord);
  
});