//
//
//These functions are work under progess please don't edit them yet
// Functions in the function.js are complete and can be used to work
//
//

function renderSearchResult(json, type, dropdownContainerEl) {
  let data = parseSearchData(json);
  dropdownContainerEl.classList = "visible";

  var resultEl = document.createElement("li");
  //
  //
  resultEl.setAttribute("class", "dropdown result");
  if (type === "podcast") {
    resultEl.setAttribute("data-podcastId", `${data.podcastId}`);
    resultEl.innerHTML = `
    <span>podcast Thumbnail:- <img width="150px" height="150px" src=${data.podcastThumbnail}></span>
    <span>Podcast title:- ${data.podcastTitle}</span>
    <span>Podcast Listen Score:- ${data.podcastListenScore}</span>
    <span>Podcast Publisher:- ${data.podcastPublisher}</span>
  `;
    dropdownContainerEl.appendChild(resultEl);
    dropdownContainerEl.addEventListener("click", updatePodcastCard);
  }

  if (type === "episode") {
    resultEl.setAttribute("data-episodeid", `${data.episodeId}`);
    resultEl.setAttribute("data-audiourl", `${data.episodeAudio}`);
    resultEl.innerHTML = `
    <span><img width="150px" height="150px" src=${data.episodeThumbnail}></span>
    <span>episode title:- ${data.episodeTitle}</span>
    <span>episode audio length:- ${data.episodeAudioLength}</span>   
  `;
    dropdownContainerEl.appendChild(resultEl);
    dropdownContainerEl.addEventListener("click", playSelectedEpisode);
  }
}

//
//
async function updatePodcastCard(e) {
  var optionSelected = e.target;
  if (optionSelected.matches(".result")) {
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
    let episodeId = optionSelected.dataset.episodeid;
    let audioURL = optionSelected.dataset.audiourl;
    let audioContainerEl = document.getElementById("audioPlayerContainer");
    console.log(audioURL);
    renderAudioPlayer(audioURL, "", audioContainerEl);
    clearSearchResult();
  }
}
