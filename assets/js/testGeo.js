// Adam's Code Below
//
//
//grab information from the Trail API.
//Will need to add extra function to click event which grabs the data
//Local Storage will be a priority

//grab information from the Trail API.
//Will need to add extra function to click event which grabs the data
//Local Storage will be a priority
//GEOPIFY API CALLS
var results = []; 
var long;
var lat;
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition,showError);
    
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showError(error){
    if (error.PERMISSION_DENIED){
      console.log("The user has denied the request for Geolocation"); 
    }
  }
function getIPAddressLocation() {
    $.getJSON('https://geolocation-db.com/json/')
         .done (function(location) {
            lat = location.latitude; 
            long = location.longitude; 
            showMap(lat,long); 
            
         });
}
function showMap(lat,long){

  var map = L.map("my-map").setView([lat, long], 14)

  // Get your own API Key on https://myprojects.geoapify.com
  var myAPIKey = "1072fcb061a849c28775a0714807e737";

  // Retina displays require different mat tiles quality
  var isRetina = L.Browser.retina;

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
  getSearchResultGeo(); 
}

async function getSearchResultGeo()
{
    $(document).ready(function () {
        $.ajax({
            //url: "https://api.geoapify.com/v2/places?categories=leisure.park&conditions=named&filter=circle:"+long.toString()+","+lat.toString()+",5000&bias=proximity:"+long.toString()+","+lat.toString()+"&lang=en&limit=20&apiKey=1072fcb061a849c28775a0714807e737", 
            url: "https://api.geoapify.com/v2/places?categories=leisure.park&conditions=named&filter=circle:-78.8635324,43.8975558,5000&bias=proximity:-78.8635324,43.8975558&lang=en&limit=20&apiKey=1072fcb061a849c28775a0714807e737",
            type: "GET", 
            success: function (result) {
                console.log(result);
                results = result; 
                displayMarkers();
            }, 
            error: function (error) {
                console.log(error); 
            }
        })
        
})  
//input = encodeURI(input);
//let url = `https://api.geoapify.com/v2/places?categories=leisure.park&conditions=named&filter=circle:${long},${lat},5000&bias=proximity:${long},${lat}&lang=en&limit=20&apiKey=${geoapifyAPIKey}`;
// let url = "https://api.geoapify.com/v2/places?categories=leisure.park&conditions=named&filter=circle:-78.8635324,43.8975558,5000&bias=proximity:-78.8635324,43.8975558&lang=en&limit=20&apiKey=1072fcb061a849c28775a0714807e737"; 

// let response = await fetch(url);
// let json = await response.json();
// let resultsArr = json.results;


// localStorage.setItem(resultsArr.name, resultsArr); 
// localStorage.setItem("Longitude", long); 
// localStorage.setItem("Latitude", lat); 

// let searchResultContainerEl = document.getElementById("geoResults");
// resultsArr.forEach((result) => {
//   renderSearchResult(result, type, searchResultContainerEl);
// });
}

var i = 0; 
function displayMarkers() {
    var markerIcon = L.icon({
        iconUrl: `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=%233e9cfe&icon=paw&apiKey=${geoapifyAPIKey}`,
        iconSize: [31, 46], // size of the icon
        iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
      });

    for (var i=0; i < results.features.length; i++)
    {
        var zooMarker = L.marker([results[i].features.i.properties.long, item.features.i.properties.lat], {
        icon: markerIcon
    }).addTo(map);
    }
}

getIPAddressLocation();


// if statement that filetes out location requests https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
