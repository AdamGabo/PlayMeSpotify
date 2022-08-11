//
//
//These functions are work under progess please don't edit them yet
// Functions in the function.js are complete and can be used to work
//
//

function renderSearchResult(json) {
  let data = parseForDropdown(json);
  let playerContainerEl = document.getElementById("audioPlayerContainer");
  renderAudioPlayer(data.audio, "", playerContainerEl);
}

function parseForDropdown(json) {
  console.log("this is recieved for parsing", json);
  let dataarr = {
    audio: json.results[0].audio,
    image: json.results[0].image,
    title: json.results[0].title_original,
    thumbnail: json.results[0].thumbnail,
  };
  return dataarr;
}
