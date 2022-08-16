// How to use renderAudioPlayer function; call the function with parameter source and container element
// Input : 1. Source = A url to the audio file to be loaded. 2. class = The class you want to give to the audio element  3. An element in which to append this player.
// output : 2. The function will append the audio tag in the element passed as parameter.

function renderAudioPlayer(src, clas = "") {
  let audioContainerEl = document.getElementById("audioPlayerContainer");
  audioContainerEl.innerText = "";
  let player = document.createElement("AUDIO");
  player.src = src;
  player.classList = clas;
  player.controls = "controls";
  player.prelaod = "metadata";
  audioContainerEl.appendChild(player);
}

// Need to add comments-----

function searchEventHandler(e) {
  e.preventDefault();
  let searchInput = document.querySelector("#searchInput");
  clearSearchResult();
  getSearchResult(searchInput.value);
  searchInput.value = "";
}

// Need to add comments-----

function clearSearchResult() {
  var resultsEl = document.getElementById("searchResults");
  resultsEl.setAttribute("class", "hidden");
  resultsEl.innerText = "";
}

// Need to add comments------

async function getSearchResult(
  input,
  offset = "0",
  len_max = "240",
  published_before = moment().unix(),
  published_after = 0,
  type = "podcast"
) {
  input = encodeURI(input);
  let url = `${proxyUrl}${baseUrl}search?q=${input}&type=${type}&offset=${offset}&len_max=${len_max}&published_before=${published_before}published_after=${published_after}&only_in=title%2Cdescription%2Cauthordescription&language=English&safe_mode=0`;

  let response = await fetch(url);
  let json = await response.json();
  let resultsArr = json.results;

  let searchResultContainerEl = document.getElementById("searchResults");
  resultsArr.forEach((result) => {
    renderSearchResult(result, type, searchResultContainerEl);
  });
}

// Need to add comments-------

function renderSearchResult(json, type, dropdownContainerEl) {
  let data = parseSearchData(json);
  dropdownContainerEl.classList = "visible";

  var resultEl = document.createElement("li");
  resultEl.setAttribute("class", "dropdown result");
  if (type === "podcast") {
    resultEl.setAttribute("data-podcastid", `${data.podcastId}`);
    resultEl.innerHTML = `
    <span>podcast Thumbnail:- <img width="150px" height="150px" src=${data.podcastThumbnail}></span>
    <span>Podcast title:- ${data.podcastTitle}</span>
    <span>Podcast Listen Score:- ${data.podcastListenScore}</span>
    <span>Podcast Publisher:- ${data.podcastPublisher}</span>
    <span>Podcast Global Rank:- ${data.podcastGlobalRank}</span>
  `;
    dropdownContainerEl.appendChild(resultEl);
    dropdownContainerEl.addEventListener("click", updatePodcastDisplay);
  }
}

// Need to add comments------

function parseSearchData(json) {
  let dataarr = {
    episodeImage: json.image,
    episodeTitle: json.title_original,
    episodeThumbnail: json.thumbnail,
    episodeAudioLength: json.audio_length_sec,
    episodeAudio: json.audio,
    episodeId: json.id,
    episodeDescription: json.description_highlighted,

    podcastListenScore: json.podcast.listen_score,
    podcastGlobalRank: json.podcast.listen_score_global_rank,
    podcastId: json.podcast.id,
    podcastImage: json.podcast.image,
    podcastThumbnail: json.podcast.thumbnail,
    podcastTitle: json.podcast.title_original,
    podcastPublisher: json.podcast.publisher_original,
  };

  return dataarr;
}

//
// Functions to set html skeleton
//

function htmlSkeletonPodcast() {
  let wrapperContainerEl = document.getElementById("podcastDisplay");
  wrapperContainerEl.innerHTML = `
  <section>
  <!-- container to display the data for a particular podcast-->
  <h1 id="podTitle"></h1>
  <article id="podDesc">
      <!-- container for podcast description -->

  </article>
  <article>
      <!-- container for episode lists -->

  </article>
  <aside id="podImg">
      <!-- container for Podcast image-->

  </aside>
</section>
  `;
}

//
// END Functions to set html skeleton
//
