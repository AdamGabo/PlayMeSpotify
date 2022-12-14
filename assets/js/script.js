//Array Content from API calls
//
// Global Variables
//
var searchOptionsArray = [];
var podcasterContentListenAPI = [];
var podcasterContentWikipedia = [];
const baseUrl = "https://listen-api-test.listennotes.com/api/v2/"; //This is mock server url change it to actual url before deploying to production//
const proxyUrl = "https://coolspotifyproxy.herokuapp.com/";
const geoapifyAPIKey = "1072fcb061a849c28775a0714807e737"; // API for geopify API
//
// Event listeners
//
document
  .getElementById("search-btn")
  .addEventListener("click", searchEventHandler);

//MAKE API CALLS TO GATHER CONTENT AND STORE IN ARRAY

//DISPLAY CONTENT (CALL from SETITEMS command first for old content stored on local storage) and call when the search button is submitted
var SetItems = function () {
  for (
    var j = 0;
    j < searchOptionsArray.length;
    j++ //example for adding divs and content, this where we can display the search options and wikipedia content via API calls
  ) {
    var eventText = $("<div>")
      .addClass("search-result")
      .text("option" + j);
    eventText.appendTo(".container");

    //add input box for event content
    var content = $("<textarea>", {
      id: "input-" + arraycontent[j],
      class: "description",
    }).appendTo(".container");
  }
  //display image of podcaster, will need to tweak info based off of API infomation
  display_image("JavaScript.jpg", 276, 110, "JavaScriptImage");

  //add podcaster info
  //display content
};
function display_image(src, width, height, alt = "") {
  var a = document.createElement("img");
  a.src = src;
  a.width = width;
  a.height = height;
  a.alt = alt;
  document.body.appendChild(a);
}

//GET STORED PREVIOUS USER CONTENT IN LOCAL STORAGE, AND DISPLAY IT
var GetnSetContent = function () {
  //
  //for (var q = 0; q < businessHours.length; q++)
  //{
  // var item = localStorage.getItem("event-container-" + businessHours[q]);
  //if (item)
  //{
  //  $("#input-" + businessHours[q]).val(item);
  //}
  //}
};
//SEARCH BUTTON EXAMPLE
$("#search-btn").on("click", function () {
  //if (value)
  //localStorage.setItem(id,value);
  //CALL FUNCTIONS WHICH DISPLAY PODCASTER CONTENT , MAKE API CALLS TO GATHER INFO INTO GLOBAL ARRAYS
});
