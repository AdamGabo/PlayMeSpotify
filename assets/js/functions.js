// How to use renderAudioPlayer function; call the function with parameter source and container element
// Input : 1. Source = A url to the audio file to be loaded. 2. class = The class you want to give to the audio element  3. An element in which to append this player.
// output : 2. The function will append the audio tag in the element passed as parameter.

function renderAudioPlayer(src, thumbnail, clas = "") {
  let audioContainerEl = document.getElementById("audioPlayerContainer");
  audioContainerEl.innerText = "";
  let imgContainer = document.createElement("div");

  imgContainer.innerHTML = `<img class="audioImage1248" src="${thumbnail}" alt="">`;
  // imgContainer.classList = "audioThumbnail1248";
  let player = document.createElement("AUDIO");
  player.src = src;
  player.classList = clas;
  player.controls = "controls";
  player.autoplay = "autoplay";
  player.prelaod = "metadata";
  audioContainerEl.appendChild(imgContainer);
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
    <span>podcast Thumbnail:- </span>
    <img width="150px" height="150px" src=${data.podcastThumbnail}>
    <span>Podcast title:- ${data.podcastTitle}</span>
    <span>Podcast Listen Score:- ${data.podcastListenScore}</span>
    <span>Podcast Publisher:- ${data.podcastPublisher}</span>
    <span>Podcast Global Rank:- ${data.podcastGlobalRank}</span>
  `;
    dropdownContainerEl.appendChild(resultEl);
    dropdownContainerEl.addEventListener("click", updatePodcastDisplay);
  }
}

// Need to add comments-----

function updatePodcastDisplay(e) {
  var optionSelected = e.target;

  if (optionSelected.matches(".result")) {
    htmlSkeletonPodcast();
    let podcastId = optionSelected.dataset.podcastid;
    getPodcastDetails(podcastId);
    clearSearchResult();
  } else {
    let parentEl = optionSelected.parentElement;
    if (parentEl.matches(".result")) {
      htmlSkeletonPodcast();
      let podcastId = parentEl.dataset.podcastid;
      console.log(podcastId);
      getPodcastDetails(podcastId);
      clearSearchResult();
    }
  }
}

// Need to add comments------

async function getPodcastDetails(podcastId, nextEpDate = "") {
  let url = `${proxyUrl}${baseUrl}podcasts/${podcastId}?next_episode_pub_date=${nextEpDate}&sort=recent_first`;

  let response = await fetch(url);
  let json = await response.json();

  renderPodcastDisplay(json);
  renderEpisodeList(json);
  console.log("response json", json);
}

// Need to add comments------
function renderPodcastDisplay(json) {
  document.getElementById("podInfo").innerHTML = `
  <article class="podInfo" >
    <h2>Description</h2>
    <p>${json.description}</p>
<h2>Country</h2>
<p>${json.country}</p>
<h2>Publiser</h2>
<p>${json.publisher}</p>
<h2>Total Episodes</h2>
<p>${json.total_episodes}</p>
</article>
  `;
  let imageContainer = document.getElementById("podImg");
  imageContainer.innerHTML = `
  <img class="podImage" src="${json.image}" alt="">
  `;
  document.getElementById("podTitle").innerText = json.title;
}
// Need to add comments------
function renderEpisodeList(json) {
  let epListContainer = document.getElementById("epList");
  let episodeListArr = json.episodes;

  console.log("use this to render episodes list", episodeListArr);
  episodeListArr.forEach((episode) => {
    let formattedLength = moment
      .utc(1000 * episode.audio_length_sec)
      .format("HH:mm:ss");
    let episodeLiEl = document.createElement("li");
    episodeLiEl.setAttribute("class", "");

    episodeLiEl.innerHTML = `
    <img class="playBtn" data-audiourl="${episode.audio}" data-thumbnailurl="${episode.thumbnail}" src="./assets/image1/play-button-icon-png-18905.png" alt="">
    <span>Title:->${episode.title}</span>
    <img src="${episode.image}" alt=""> 
    <span><h3>Description</h3>${episode.description}</span>
    <span><h3>Episode Length</h3>${formattedLength}</span>
`;
    epListContainer.appendChild(episodeLiEl);
  });
  epListContainer.addEventListener("click", playEpisode);
}
// Need to add comments------
function playEpisode(e) {
  var optionSelected = e.target;
  if (optionSelected.matches(".playBtn")) {
    console.log("audio Played");
    let audioUrl = optionSelected.dataset.audiourl;
    let imageUrl = optionSelected.dataset.thumbnailurl;
    renderAudioPlayer(audioUrl, imageUrl);
  }
}
// Need to add comments------

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
  <section id="podInfo">
      <!-- container for podcast description -->

  </section>
  
  <aside id="podImg">
      <!-- container for Podcast image-->

  </aside>
  <section >
      <!-- container for episode lists -->
      <ul id="epList">
      </ul>
  </section>
</section>
  `;
}

//
// END Functions to set html skeleton
//
