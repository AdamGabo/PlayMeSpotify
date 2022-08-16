// Adam's Code Below
//
//GEOPIFY API CALLS, MULTIPLE APIs FROM THE "GEOAPIFY FAMILY" HAVE BEEN USED IN THE APPLICATION, STANDARD CODE (AS DEFINED IN THE API DOCUMENTATION) FOR THE SEARCH BAR HAS BEEN UTILIZED 
//GLOBAL VARIABLE FOR THE MAP 
var map; 
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
            getSearchResultGeo(oldData.properties.long, oldData.properties.lat)
            showMap(oldData.properties.lat,oldData.properties.long); 

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
}

//MAKE REQUEST TO GET ALL THE LOCATIONS IN A 5000m RADIUS OF THE DESIRED LOCATION
async function getSearchResultGeo(long, lat)
{
    $(document).ready(function () {
        $.ajax({
            url: `https://api.geoapify.com/v2/places?categories=leisure.park&conditions=named&filter=circle:${long},${lat},5000&bias=proximity:${long},${lat}&lang=en&limit=1&apiKey=1072fcb061a849c28775a0714807e737`,
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
    //FOR LOOP WHICH GOES THROUGH ALL THE PARKS IN THE AREA 
    for (var i=0; i < results.features.length; i++)
    {
        var geoLong = results.features[i].properties.lon; 
        var geoLat = results.features[i].properties.lat; 

        var markerPopup = L.popup().setContent(results.features[i].properties.address_line1 + ", " + results.features[i].properties.address_line2); 
        var marker = L.marker([geoLat,geoLong], {
        icon: markerIcon
    }).bindPopup(markerPopup).addTo(map);
    }
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
    getSearchResultGeo(data.properties.lon, data.properties.lat); 
    //MOVE MAP TO DESIRED LOCATION
    map.setView([data.properties.lat, data.properties.lon], 14)
    localStorage.setItem("Previous Address", data.properties);

  }, {
      placeholder: "Enter an address here"
  });

//ROUTING FEATURE

//CLICK EVENT

async function getRoutingResultGeo(destinationData,userLocationData)
{

    var dLon = destinationData.properties.lon; 
    var dLat = destinationData.properties.lat; 

    var uLon = userLocationData.properties.lon;
    var uLat = userLocationData.properties.lat;

    $(document).ready(function () {
        $.ajax({
            url: `https://api.geoapify.com/v1/routing?waypoints=${dLat},${dLon}|${uLat},${uLon}&mode=drive&lang=en&details=instruction_details&apiKey=${geoapifyAPIKey}`,
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

  // The API Key provided is restricted to JSFiddle website
// Get your own API Key on https://myprojects.geoapify.com
var myAPIKey = "6dc7fb95a3b246cfa0f3bcef5ce9ed9a";

const map = new maplibregl.Map({
  container: 'my-map',
  style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${myAPIKey}`,
  center: [-72.79419772520356, 44.53361448499783],
  zoom: 14
});
map.addControl(new maplibregl.NavigationControl());

const popup = new maplibregl.Popup();

// calculate and display routing:
// from 38.937165,-77.045590 (1208 Hourglass Drive, Stowe, VT 05672, United States of America)
const fromWaypoint = [-72.78056761690857, 44.53000255267429]; // longitude, latutude
const fromWaypointMarker = new maplibregl.Marker().setLngLat(fromWaypoint)
  .setPopup(new maplibregl.Popup().setText(
    '1208 Hourglass Drive, Stowe, VT 05672, United States of America'
  )).addTo(map);


// to 38.881152,-76.990693 (Switchback, Stowe, VT 05672-5111, United States of America)
const toWaypoint = [-72.80797096598127, 44.536552001130076]; // longitude, latutude
const toWaypointMarker = new maplibregl.Marker().setLngLat(toWaypoint)
  .setPopup(new maplibregl.Popup().setText(
    'Switchback, Stowe, VT 05672-5111, United States of America'
  )).addTo(map);

let routeData;
let routeStepsData;
let instructionsData;
let stepPointsData;

fetch(`https://api.geoapify.com/v1/routing?waypoints=lonlat:${fromWaypoint.join(",")}|lonlat:${toWaypoint.join(",")}&mode=hike&details=route_details,elevation&apiKey=${myAPIKey}`).then(res => res.json()).then(routeResult => {
  routeData = routeResult;
  const steps = [];
  const instructions = [];
  const stepPoints = [];

  routeData.features[0].properties.legs.forEach((leg, legIndex) => {
    const legGeometry = routeData.features[0].geometry.coordinates[legIndex];
    leg.steps.forEach((step, index) => {
      if (step.instruction) {
        instructions.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": legGeometry[step.from_index]
          },
          properties: {
          	text: step.instruction.text
          }
        });
      }

      if (index !== 0) {
        stepPoints.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": legGeometry[step.from_index]
          },
          properties: step
        })
      }

      if (step.from_index === step.to_index) {
        // destination point
        return;
      }

      const stepGeometry = legGeometry.slice(step.from_index, step.to_index + 1);
      steps.push({
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": stepGeometry
        },
        properties: step
      });
    });
  });

  routeStepsData = {
    type: "FeatureCollection",
    features: steps
  }

  instructionsData = {
    type: "FeatureCollection",
    features: instructions
  }

  stepPointsData = {
    type: "FeatureCollection",
    features: stepPoints
  }

  map.addSource('route', {
    type: 'geojson',
    data: routeData
  });
  
  map.addSource('points', {
    type: 'geojson',
    data: instructionsData
  });
  
 	addLayerEvents();
  drawRoute();
}, err => console.log(err));

function drawRoute() {
  if (!routeData) {
    return;
  }

  if (map.getLayer('route-layer')) {
    map.removeLayer('route-layer')
  }
  
  if (map.getLayer('points-layer')) {
  	map.removeLayer('points-layer')
  }

  if (document.getElementById("showDetails").checked) {
    map.getSource('route').setData(routeStepsData);
    map.addLayer({
      'id': 'route-layer',
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-join': "round",
        'line-cap': "round"
      },
      'paint': {
        'line-color': [
          'match',
          ['get', 'road_class'],
          'motorway',
          '#009933',
          'trunk',
          '#00cc99',
          'primary',
          '#009999',
          'secondary',
          '#00ccff',
          'tertiary',
          '#9999ff',
          'residential',
          '#9933ff',
          'service_other',
          '#ffcc66',
          'unclassified',
          '#666699',
          /* other */
          '#666699'
        ],
        'line-width': 8
      }
    });
    
    map.getSource('points').setData(stepPointsData);
    map.addLayer({
      'id': 'points-layer',
      'type': 'circle',
      'source': 'points',
      'paint': {
        'circle-radius': 4,
        'circle-color': "#ddd",
        'circle-stroke-color': "#aaa",
        'circle-stroke-width': 1,
      }
    });
  } else {
    map.getSource('route').setData(routeData);
    map.addLayer({
      'id': 'route-layer',
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-cap': "round",
        'line-join': "round"
      },
      'paint': {
        'line-color': "#6084eb",
        'line-width': 8
      },
      'filter': ['==', '$type', 'LineString']
    });
    
    map.getSource('points').setData(instructionsData);
    map.addLayer({
      'id': 'points-layer',
      'type': 'circle',
      'source': 'points',
      'paint': {
        'circle-radius': 4,
        'circle-color': "#fff",
        'circle-stroke-color': "#aaa",
        'circle-stroke-width': 1,
      }
    });
  }
}

function addLayerEvents() {
  map.on('mouseenter', 'route-layer', () => {
  	map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'route-layer', () => {
  	map.getCanvas().style.cursor = '';
  });
  
  map.on('mouseenter', 'points-layer', () => {
  	map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'points-layer', () => {
  	map.getCanvas().style.cursor = '';
  });
  
  map.on('click', 'route-layer', (e) => { 
  	if (document.getElementById("showDetails").checked) {   
     	const stepData = e.features[0].properties;
    	const propertiesToShow = ["surface", "elevation", "elevation_gain"];
      const dataToShow = {};
      propertiesToShow.forEach(property => {
      	if (stepData[property] || stepData[property] === 0) {
        	dataToShow[property] = stepData[property];
        }
      });
      
      showPopup(dataToShow, e.lngLat);
    } else {
    	showPopup({
      	distance: `${e.features[0].properties.distance} m`,
        time: `${e.features[0].properties.time} s`
      }, e.lngLat);      
    }
    e.preventDefault();
  })

  map.on('click', 'points-layer', (e) => {
  	const properties = e.features[0].properties;
   	const point = e.features[0].geometry.coordinates;
    
    if (properties.text) {
    	popup.setText(properties.text);
      popup.setLngLat(point);
      popup.addTo(map);
      e.preventDefault();
    }
  });
}


function showPopup(data, lngLat) {
	let popupHtml = Object.keys(data).map(key => {
  	return `<div class="popup-property-container">
    					<span class="popup-property-label">${key}: </span>
              <span class="popup-property-value">${data[key]}</span>
            </div>`
  }).join(''); 
   
 	popup.setLngLat(lngLat).setHTML(popupHtml).addTo(map);
}

  
//FIRST INTIALIZATION FOR MAP API FEATURE
getIPAddressLocation();

//POTENTIAL UPGRADES FOR FUTURE ITEMS 
