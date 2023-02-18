// ------------------- map render -------------------------------
export let defaultPosition = {"Latitude": 5.037166634859183, "Longitude": 7.923794387173782};

// create a map in the map div
let m = L.map('map').setView(L.latLng(defaultPosition["Latitude"], defaultPosition["Longitude"]), 16);
let route = null;
export let featuregp;

export function initialRenderMap(geojsonData){
    let tile_layer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {"attribution": "Data by \u0026copy; \u003ca target=\"_blank\" href=\"http://openstreetmap.org\"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca target=\"_blank\" href=\"http://www.openstreetmap.org/copyright\"\u003eODbL\u003c/a\u003e.", "detectRetina": false, "maxNativeZoom": 18, "maxZoom": 18, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false}
    ).addTo(m);

    let layerControl = L.control.layers().addTo(m);
    layerControl.addBaseLayer(tile_layer, "BaseMap");

    featuregp = L.featureGroup().addTo(m);

    geojsonData.forEach(element => {
        let overlay = L.geoJson(element["data"]).addTo(m);
        layerControl.addOverlay(overlay, element["name"]);
        featuregp.addLayer(overlay);

    });

    // zoom to extents of geojson
    m.fitBounds(featuregp.getBounds());

}
                                  
export function findRoute(startCoord, endCoord){
    if(route!=null){
      // clear the last route
      // try removing from map
      route.remove(m);
  
    }

    route = L.Routing.control({
                                waypoints: [
                                    L.latLng(startCoord['Latitude'], startCoord['Longitude']),
                                    L.latLng(endCoord['Latitude'], endCoord['Longitude'])
                                ],
                                routeWhileDragging: true,
                                fitSelectedRoutes: true
                            }).addTo(m);
  
}