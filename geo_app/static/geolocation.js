import { featuregp, defaultPosition } from './mapping.js';

// ------------------- geolocation handling --------------------------
let currentPosition;
let isGeoLocationActive;

let geoLoc = navigator.geolocation;
let watchID;
let locationTrackingOptions = {
    timeout: 60000
  
}

export function updateStartLocation(){
    // get the selected item of the dropdown list 
    // and update start location with it
    let dropDown = document.getElementById("startLocationList");
    let info = dropDown.options[dropDown.selectedIndex].value;
    currentPosition = JSON.parse(info)["REP_COORDS"];
  
}

function updateDeviceLocationDisplay(){
    let deviceLocationDisplay = document.getElementById("currentLocation");
    console.log(currentPosition);
    deviceLocationDisplay.innerHTML = `<p class="text-center fs-1 fw-bold font-monospace">
                                            Latitude: ${currentPosition['Latitude']}
                                            Longitude: ${currentPosition['Longitude']}
                                            <p class="text-center fs-4 fw-bold font-monospace text-success">
                                                (Main gate)
                                            </p>
                                        </p>`
  
}

export function getStartLocation(){
    if(!isGeoLocationActive) updateStartLocation();
    return currentPosition;
  
}
  
export function getEndLocation(){
  // get the selected item of the dropdown list and return
  // as a dictionary
  let dropDown = document.getElementById("destinationLocationList");
  let info = dropDown.options[dropDown.selectedIndex].value;
  return JSON.parse(info)["REP_COORDS"];

}

function setLocation(position){
    // check if featuregp containing the geojson data
    // contains this location
    let coord = L.latLng(position.coords.latitude, position.coords.longitude);

    if (featuregp.getBounds().contains(coord)){
        currentPosition = {"Latitude": position.coords.latitude, "Longitude": position.coords.longitude};
  
    } else {
        currentPosition = defaultPosition;

        // TODO: Use the error label below the location to display
        // this message
        alert("You are out of the campus area, using default loction instead");

    }

    updateDeviceLocationDisplay();
 
}

function errorHandler(error){    
    currentPosition = defaultPosition;

    updateDeviceLocationDisplay();

    // TODO: Use the error label below the location to display
    // this message
    alert("Error in updating current location, using Main gate as default location");
  
}

export function canGeolocate(){
    return (geoLoc);

}

export function disableGeolocation(){
    geoLoc.clearWatch(watchID);
    currentPosition = defaultPosition;
    isGeoLocationActive = false;
  
}

export function enableGeolocation(){
    // initialize location display
    //geoLoc.getCurrentPosition(setLocation, errorHandler, locationTrackingOptions);

    // track location
    watchID = geoLoc.watchPosition(setLocation, errorHandler, locationTrackingOptions);

    isGeoLocationActive = true;

}