//
//
//These functions are work under progess please don't edit them yet
// Functions in the function.js are complete and can be used to work
//
//

//
//
// Bawan's Code Below
//
//

//
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

var longitude;
var latitude;
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  console.log(latitude);
  console.log(longitude);
}

var map = L.map("my-map").setView([10, 10], 10);

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

getLocation();

// if statement that filetes out location requests https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
