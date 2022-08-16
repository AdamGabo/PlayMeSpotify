// Adam's Code Below
//
//GEOPIFY API CALLS, MULTIPLE APIs FROM THE "GEOAPIFY FAMILY" HAVE BEEN USED IN THE APPLICATION, STANDARD CODE (AS DEFINED IN THE API DOCUMENTATION) FOR THE SEARCH BAR HAS BEEN UTILIZED 
//GLOBAL VARIABLE FOR THE MAP 
var map; 
var mapMarkers = []; 
var routes = []; 
//GET THE DEFAULT LOCATION OF THE MAP FROM LOCAL STORAGE (PREVIOUS DATA ENTRY) OR FROM IP ADDRESS LOCATION (DEFAULT FOR COUNTY - PERMISSION FROM WEB BROWSER NOT NEEDED)
function getIPAddressLocation() {
    $.getJSON('https://geolocation-db.com/json/')
         .done (function(location) {
            var lat = location.latitude; 
            var long = location.longitude; 

            //IF OLD ADDRESS IS STORED IN LOCAL STORAGE SHOW THAT ITEM INSTEAD 
            if (localStorage.getItem("Previous Address"))
            {
            var oldData = (localStorage.getItem("Previous Address")); 
            oldData = JSON.parse(oldData);
            if (oldData.lon && oldData.lat)
            {
            getSearchResultGeo(oldData.lon, oldData.lat)
            showMap(oldData.lat,oldData.lon); 
            displayHomeMarkerLocalStorage(oldData); 
            }
            else 
            {
                showMap(lat,long); 
            }
            }
            else 
            {
                showMap(lat,long); 
            }
         });
}
//INTIALIZE THE MAP AND GATHER THE RASTER IMAGES FROM LEAFLET 
function showMap(lat,long){
  //create the map 
  map = L.map("my-map").setView([lat, long], 14);

  var myAPIKey = geoapifyAPIKey;

  // Retina displays require different mat tiles quality
  var isRetina = L.Browser.retina;
  //DISPLAY URLs 
  var GeoUrl =
    "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}";
  var retinaUrl =
    "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}";

  // Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
  L.tileLayer(isRetina ? retinaUrl : GeoUrl, {
    attribution:
      'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>',
    apiKey: myAPIKey,
    maxZoom: 20,
    id: "osm-bright",
  }).addTo(map); 

  clearMapMarkersRoutes(); 
}

//MAKE REQUEST TO GET ALL THE LOCATIONS IN A 5000m RADIUS OF THE DESIRED LOCATION
async function getSearchResultGeo(long, lat)
{
    $(document).ready(function () {
        $.ajax({
            url: `https://api.geoapify.com/v2/places?categories=leisure.park&conditions=named&filter=circle:${long},${lat},5000&bias=proximity:${long},${lat}&lang=en&limit=20&apiKey=1072fcb061a849c28775a0714807e737`,
            type: "GET", 
            success: function (result) {
                console.log(result);
                results = result; 
                displayMarkers(results);
            }, 
            error: function (error) {
                console.log(error); 
            }
        })
})  
}

//DISPLAY MARKERS OF REQUESTED LOCATION WITH POPUPS
function displayMarkers(results) {
    var markerIcon = L.icon({
        iconUrl: `https://api.geoapify.com/v1/icon?type=awesome&color=%2332e713&icon=tree&apiKey=${geoapifyAPIKey}`,
        iconSize: [31, 46], // size of the icon
        iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
      });
    //FOR LOOP WHICH GOES THROUGH ALL THE PARKS IN THE AREA, ADDED CLICK EVENT FEATURE ADDED 
    for (var i=0; i < results.features.length; i++)
    {
        var geoLong = results.features[i].properties.lon; 
        var geoLat = results.features[i].properties.lat; 

        var markerPopup = L.popup().setContent(results.features[i].properties.address_line1 + ", " + results.features[i].properties.address_line2); 
        var marker = L.marker([geoLat,geoLong], {
        icon: markerIcon, 
        data: results.features[i] 
    }).bindPopup(markerPopup).addTo(map).on('dblclick', ondblClick);
    mapMarkers.push(marker); 
    }
}
function displayHomeMarker(results) {

    var markerIcon = L.icon({
        iconUrl: `https://api.geoapify.com/v1/icon?type=awesome&color=%2315d4eb&icon=lightbulb&apiKey=${geoapifyAPIKey}`,
        iconSize: [31, 46], // size of the icon
        iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
      });
    //FOR LOOP WHICH GOES THROUGH ALL THE PARKS IN THE AREA, ADDED CLICK EVENT FEATURE ADDED 
    
        var geoLong = results.properties.lon; 
        var geoLat = results.properties.lat; 

        var markerPopup = L.popup().setContent(results.properties.address_line1 + ", " + results.properties.address_line2); 
        var marker = L.marker([geoLat,geoLong], {
        icon: markerIcon, 
    }).bindPopup(markerPopup).addTo(map);
    mapMarkers.push(marker); 
    }
    function displayHomeMarkerLocalStorage(results) {
    
        var markerIcon = L.icon({
            iconUrl: `https://api.geoapify.com/v1/icon?type=awesome&color=%2315d4eb&icon=lightbulb&apiKey=${geoapifyAPIKey}`,
            iconSize: [31, 46], // size of the icon
            iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
          });
        //FOR LOOP WHICH GOES THROUGH ALL THE PARKS IN THE AREA, ADDED CLICK EVENT FEATURE ADDED 
        
            var geoLong = results.lon; 
            var geoLat = results.lat; 
    
            var markerPopup = L.popup().setContent(results.address); 
            var marker = L.marker([geoLat,geoLong], {
            icon: markerIcon, 
        }).bindPopup(markerPopup).addTo(map);
        mapMarkers.push(marker); 
        }
//CREATE SEARCH BAR FOR USER AFTER DEFAULT HAS BEEN SET, STANDARD GEOAPIFY API CODE HAS BEEN USED FOR THIS FEATURE source:https://apidocs.geoapify.com/samples/autocomplete/autocomplete-tutorial/#step-1, MODIFCATIONS WERE MADE TO FIT OUR APPLICATION 
/* 
	The addressAutocomplete takes as parameters:
  - a container element (div)
  - callback to notify about address selection
  - geocoder options:
  	 - placeholder - placeholder text for an input element
     - type - location type
*/
function addressAutocomplete(containerElement, callback, options) {
    // create input element
    var inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", options.placeholder);
    containerElement.appendChild(inputElement);
  
    // add input field clear button
    var clearButton = document.createElement("div");
    clearButton.classList.add("clear-button");
    addIcon(clearButton);
    clearButton.addEventListener("click", (e) => {
      e.stopPropagation();
      inputElement.value = '';
      callback(null);
      clearButton.classList.remove("visible");
      closeDropDownList();
    });
    containerElement.appendChild(clearButton);
  
    /* Current autocomplete items data (GeoJSON.Feature) */
    var currentItems;
  
    /* Active request promise reject function. To be able to cancel the promise when a new request comes */
    var currentPromiseReject;
  
    /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
    var focusedItemIndex;
  
    /* Execute a function when someone writes in the text field: */
    inputElement.addEventListener("input", function(e) {
      var currentValue = this.value;
  
      /* Close any already open dropdown list */
      closeDropDownList();
  
      // Cancel previous request promise
      if (currentPromiseReject) {
        currentPromiseReject({
          canceled: true
        });
      }
  
      if (!currentValue) {
        clearButton.classList.remove("visible");
        return false;
      }
  
      // Show clearButton when there is a text
      clearButton.classList.add("visible");
  
      /* Create a new promise and send geocoding request */
      var promise = new Promise((resolve, reject) => {
        currentPromiseReject = reject;
  

        var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&limit=5&apiKey=${geoapifyAPIKey}`;
        
        if (options.type) {
            url += `&type=${options.type}`;
        }
  
        fetch(url)
          .then(response => {
            // check if the call was successful
            if (response.ok) {
              response.json().then(data => resolve(data));
            } else {
              response.json().then(data => reject(data));
            }
          });
      });
  
      promise.then((data) => {
        currentItems = data.features;
  
        /*create a DIV element that will contain the items (values):*/
        var autocompleteItemsElement = document.createElement("div");
        autocompleteItemsElement.setAttribute("class", "autocomplete-items");
        containerElement.appendChild(autocompleteItemsElement);
  
        /* For each item in the results */
        data.features.forEach((feature, index) => {
          /* Create a DIV element for each element: */
          var itemElement = document.createElement("DIV");
          /* Set formatted address as item value */
          itemElement.innerHTML = feature.properties.formatted;
  
          /* Set the value for the autocomplete text field and notify: */
          itemElement.addEventListener("click", function(e) {
            inputElement.value = currentItems[index].properties.formatted;
  
            callback(currentItems[index]);
  
            /* Close the list of autocompleted values: */
            closeDropDownList();
          });
  
          autocompleteItemsElement.appendChild(itemElement);
          
        });
      }, (err) => {
        if (!err.canceled) {
          console.log(err);
        }
      });
    });
  
    /* Add support for keyboard navigation */
    inputElement.addEventListener("keydown", function(e) {
      var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
      if (autocompleteItemsElement) {
        var itemElements = autocompleteItemsElement.getElementsByTagName("div");
        if (e.keyCode == 40) {
          e.preventDefault();
          /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
          focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
          /*and and make the current item more visible:*/
          setActive(itemElements, focusedItemIndex);
        } else if (e.keyCode == 38) {
          e.preventDefault();
  
          /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
          focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
          /*and and make the current item more visible:*/
          setActive(itemElements, focusedItemIndex);
        } else if (e.keyCode == 13) {
          /* If the ENTER key is pressed and value as selected, close the list*/
          e.preventDefault();
          if (focusedItemIndex > -1) {
            closeDropDownList();
          }
        }
      } else {
        if (e.keyCode == 40) {
          /* Open dropdown list again */
          var event = document.createEvent('Event');
          event.initEvent('input', true, true);
          inputElement.dispatchEvent(event);
        }
      }
    });
  
    function setActive(items, index) {
      if (!items || !items.length) return false;
  
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("autocomplete-active");
      }
  
      /* Add class "autocomplete-active" to the active element*/
      items[index].classList.add("autocomplete-active");
  
      // Change input value and notify
      inputElement.value = currentItems[index].properties.formatted;
      callback(currentItems[index]);
    }
  
    function closeDropDownList() {
      var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
      if (autocompleteItemsElement) {
        containerElement.removeChild(autocompleteItemsElement);
      }
  
      focusedItemIndex = -1;
    }
  
    function addIcon(buttonElement) {
      var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
      svgElement.setAttribute('viewBox', "0 0 24 24");
      svgElement.setAttribute('height', "24");
  
      var iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
      iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
      iconElement.setAttribute('fill', 'currentColor');
      svgElement.appendChild(iconElement);
      buttonElement.appendChild(svgElement);
    }
    
      /* Close the autocomplete dropdown when the document is clicked. 
        Skip, when a user clicks on the input field */
    document.addEventListener("click", function(e) {
      if (e.target !== inputElement) {
        closeDropDownList();
      } else if (!containerElement.querySelector(".autocomplete-items")) {
        // open dropdown list again
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        inputElement.dispatchEvent(event);
      }
    });
  
  }
    //SET THE DATA FROM USER SELECTION 
    addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {
    console.log("Selected option: ");
    console.log(data);

    //LOAD IN MARKERS FROM SEARCH RESULT
    if (mapMarkers)
        clearMapMarkersRoutes(); 

    getSearchResultGeo(data.properties.lon, data.properties.lat); 
    //MOVE MAP TO DESIRED LOCATION
    map.setView([data.properties.lat, data.properties.lon], 14)
    if (data)
    {
        displayHomeMarker(data); 
        var inputData = {
            lat: data.properties.lat,
            lon: data.properties.lon,
            address: data.properties.formatted
        };
    localStorage.setItem("Previous Address", JSON.stringify(inputData));
    }

  }, {
      placeholder: "Enter an address here"
  });

//ROUTING FEATURE, ADDS ROUTES BETWEEN TWO DESTINATION ON AN ICON DOUBLE CLICK 

//MAKE API CALL FOR ROUTE source:https://apidocs.geoapify.com/docs/routing/#code-samples
async function getRoutingResultsGeo(destinationData,userLocationData)
{
    var fromWaypoint = [userLocationData.lat, userLocationData.lon]; // latutude, longitude
    var toWaypoint = [destinationData.lat, destinationData.lon]; // latitude, longitude
    var routingUrl = `https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(',')}|${toWaypoint.join(',')}&mode=drive&details=instruction_details&apiKey=${geoapifyAPIKey}`;

    fetch(routingUrl).then(res => res.json()).then(result => {
    console.log(result);
    if (result)
    localStorage.setItem("Route-Data", JSON.stringify(result)); 
    //ADD ROUTE TO MAP 
    addRouteToMap(result); 
}, error => console.log(err));
}
//ADD ROUTE TO MAP AS PER API DOCUMENTATION source: https://apidocs.geoapify.com/docs/routing/#routing
function addRouteToMap(routeResult)
{
    var route = L.geoJSON(routeResult, {
    style: (feature) => {
        return {
        color: "rgba(20, 137, 255, 0.7)",
        weight: 5
        };
    }
    }).bindPopup((layer) => {
    return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`
    }).addTo(map);
    if (route)
    routes.push(route); 

    const turnByTurns = []; // collect all transitions
    routeResult.features.forEach(feature => feature.properties.legs.forEach((leg, legIndex) => leg.steps.forEach(step => {
    const pointFeature = {
        "type": "Feature",
        "geometry": {
        "type": "Point",
        "coordinates": feature.geometry.coordinates[legIndex][step.from_index]
        },
        "properties": {
        "instruction": step.instruction.text
        }
    }
    turnByTurns.push(pointFeature);
    })));

    L.geoJSON({
    type: "FeatureCollection",
    features: turnByTurns
    }, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, turnByTurnMarkerStyle);
    }
    }).bindPopup((layer) => {
    return `${layer.feature.properties.instruction}`
    }).addTo(map);
    // if (layer)
    // mapMarkers.push(layer); 
}
//DISPLAY ROUTE MARKERS 
function displayRoutingMarkers(destinationData,userLocationData) {
    
    for(var i =0; i<2; i++)
    {
        var data; 
        var icon; 
        var color;
        if (i === 0)
        {
            data = destinationData; 
            color = "%2332e713";
            icon = "tree";

        }
        else 
        {
            data = userLocationData; 
            color = "%2315d4eb"; 
            icon = "lightbulb";
        }

        var markerIcon = L.icon({
            iconUrl: `https://api.geoapify.com/v1/icon?type=awesome&color=${color}&icon=${icon}&apiKey=${geoapifyAPIKey}`,
            iconSize: [31, 46], // size of the icon
            iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
          });
        var markerPopup = L.popup().setContent(data.address); 
        var marker = L.marker([data.lat,data.lon], {
        icon: markerIcon
    }).bindPopup(markerPopup).addTo(map);
    if (marker)
    mapMarkers.push(marker); 
    }
}
//CLICK EVENT FOR ROUTING WHEN MARKER IS DOUBLE CLICKED
function ondblClick(e) {
    clearMapMarkersRoutes(); 
    //CLEAR MAP MARKERS/ROUTE LAYERS 
    if (map.mapMarkers)
        map.markers.clearLayers();
    console.log(e.latlng);
    var inputData = {
        lat: e.latlng.lat,
        lon: e.latlng.lng,
        address: "Destination"
    };
    var destinationData= inputData; 
    var userLocationData = localStorage.getItem("Previous Address");
    userLocationData = JSON.parse(userLocationData); 
    displayRoutingMarkers(destinationData,userLocationData); 
    getRoutingResultsGeo(destinationData,userLocationData); 
}
//CLEAR THE MAP FUNCTION 
function clearMapMarkersRoutes()
{
    if (mapMarkers.length > 0)
    {
        for(var i = 0; i < mapMarkers.length; i++){
            map.removeLayer(mapMarkers[i]);
        }
    }
    if (routes.length > 0)
    {
        for(var i = 0; i < routes.length; i++){
            map.removeControl(routes[i]);
        }
    }
    
}
//RESET BUTTON FEATURE TO CLEAR CONTENTS 
$( "#reset-button" ).click(function() {
    clearMapMarkersRoutes(); 
  });

//FIRST INTIALIZATION FOR MAP API FEATURE
getIPAddressLocation();


