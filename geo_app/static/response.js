import { initialRenderMap } from './mapping.js';
import { requestLocations } from './requests.js';

export function clearDropDown(dropDownID){
    let dropDown = document.getElementById(dropDownID);
    dropDown.innerHTML = "";

}

export function getSelectedCategoryID(dropDownID){
    let dropDown = document.getElementById(dropDownID);
    return dropDown.options[dropDown.selectedIndex].value;

}

export function getSelectedCategoryName(dropDownID){
    let dropDown = document.getElementById(dropDownID);
    return dropDown.options[dropDown.selectedIndex].text;

}

export function reloadLocations(categoryDropDown, locationDropDown){
    // Get the categoryID and categoryName that is selected
    let catID = getSelectedCategoryID(categoryDropDown.id); 
    let catName = getSelectedCategoryName(categoryDropDown.id);
 
    // load locations of the selected category
    requestLocations(catID, catName, useLocationData, locationDropDown);

}

export function useLocationData(locationData, locationDropDown){
    clearDropDown(locationDropDown.id);

    let items = locationData["items"];
    let count = locationData["count"];

    // create option elements for each item in the names array
    for(let i=0; i<count-1; i++){
        let loc_name = items[i]['NAME'];

        let optionEl = document.createElement("option");
        optionEl.value = JSON.stringify(items[i]);
        optionEl.text = loc_name;

        locationDropDown.appendChild(optionEl);

    }

}

export function useCategoryData(categoryData, categoryDropDown, locationDropDown){
    clearDropDown(categoryDropDown.id);

    // load categories
    let data = categoryData['categories'];
  
    // load the categoryData into the dropDown
    // categoryData is a dictionary
    // each entry in categoryData has the form
    // key = the id location category name
    // value = the location category name
    for(let id in data){
      let categoryName = data[id];
      
      let optionEl = document.createElement("option");
      optionEl.value = id;
      optionEl.text = categoryName;
  
      categoryDropDown.appendChild(optionEl);
  
    }

    // request for locations from server, and load into dropdown
    reloadLocations(categoryDropDown, locationDropDown);    

}

export function useMapData(mapData){
    // render map with leaflet
    initialRenderMap(mapData["geojsonData"]);

}