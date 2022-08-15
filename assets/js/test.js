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
//
//
// if (type === "episode") {
//   resultEl.setAttribute("data-episodeid", `${data.episodeId}`);
//   resultEl.setAttribute("data-audiourl", `${data.episodeAudio}`);
//   resultEl.innerHTML = `
//   <span><img width="150px" height="150px" src=${data.episodeThumbnail}></span>
//   <span>episode title:- ${data.episodeTitle}</span>
//   <span>episode audio length:- ${data.episodeAudioLength}</span>
// `;
//   dropdownContainerEl.appendChild(resultEl);
//   dropdownContainerEl.addEventListener("click", playSelectedEpisode);
// }
//
//
//

//
//
async function updatePodcastDisplay(e) {
  var optionSelected = e.target;
  if (optionSelected.matches(".result")) {
    htmlSkeletonPodcast();
    let podcastId = optionSelected.dataset.podcastId;
    console.log("do something with the podcast ID to display it");
    clearSearchResult();
  }
}
//
//

function playSelectedEpisode(e) {
  var optionSelected = e.target;
  if (optionSelected.matches(".result")) {
    let audioURL = optionSelected.dataset.audiourl;
    renderAudioPlayer(audioURL, "");
    clearSearchResult();
  }
}

//
//
// Adam's Code Below
//
//
//grab information from the Trail API.
//Will need to add extra function to click event which grabs the data
//Local Storage will be a priority

var x = document.getElementById("demo");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;
}

// if statement that filetes out location requests https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
