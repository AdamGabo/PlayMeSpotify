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
  let searchResultContainerEl = document.getElementById("searchResults");
  displayLoading(searchResultContainerEl);
  let response = await fetch(url);
  let json = await response.json();
  let resultsArr = json.results;
  setTimeout(() => {
    searchResultContainerEl.innerHTML = "";
    resultsArr.forEach((result) => {
      renderSearchResult(result, type, searchResultContainerEl);
    });
  }, 500);
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
    <article class="media removeClick1248">
    <figure class="media-left">
        <p class="image is-64x64">
            <img width="150px" height="150px" src=${data.podcastThumbnail}>
        </p>
    </figure>
    <div class="media-content">
        <div class="content">
            <p>
                <strong>${data.podcastTitle}</strong>
            </p>
        </div>
        <div class="level ">
            <div class="level-right">
                <span class="level-item">
                    <span>Listen Score:- ${data.podcastListenScore}</span>
                </span>
                <span class="level-item">
                    <span>Publisher:- ${data.podcastPublisher}</span>
                </span>
                <span class="level-item">
                    <span>Global Rank:- ${data.podcastGlobalRank}</span>
                </span>
            </div>
        </div>
    </div>
</article>
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
    <h2 class="text is-size-5-mobile is-size-4-touch is-size-3-tablet has-text-weight-bold">Description</h2>
    <p class="text is-size-6-mobile is-size-5-touch is-size-4-tablet">${json.description}</p>
    <div class="level ">
    <div class="level-right py-3">
        <span class="level-item">
            <h2 class="has-text-weight-bold">
                Country: </h2>
            <p class="text has-text-weight-bold">${json.country}</p>
        </span>
        <span class="level-item">
            <h2 class=" has-text-weight-bold">
                Publisher: </h2>
            <p class="text has-text-weight-bold">${json.publisher}</p>
        </span>
        <span class="level-item">
            <h2 class=" has-text-weight-bold">
                Total Episodes: </h2>
            <p class="text has-text-weight-bold">${json.total_episodes}</p>
        </span>
    </div>
</div>
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

  episodeListArr.forEach((episode) => {
    let formattedLength = moment
      .utc(1000 * episode.audio_length_sec)
      .format("HH:mm:ss");
    var dateString = moment.unix(episode.pub_date_ms).format("MM/DD/YYYY");
    let episodeLiEl = document.createElement("li");
    episodeLiEl.setAttribute(
      "class",
      "notification is-info is-light columns is-right"
    );

    episodeLiEl.innerHTML = `
    <img class="playBtn column is-1" data-audiourl="${episode.audio}" data-thumbnailurl="${episode.thumbnail}" src="./assets/image1/play (1).png" alt="">
    <span class="column centre1248 is-size-3">${episode.title}</span>
    <span class="column is-2 centre1248">Episode Date<br>${dateString}</span>
    <span class="column is-2 centre1248">${formattedLength}</span>
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
  <div class="columns pt-3">
                    
  <aside class="column is-2" id="podImg">
  <!-- container for Podcast image-->

      
  </aside>
  <h1 class="column is-10 text is-size-7-mobile is-size-3-touch is-size-1-tablet has-text-weight-bold " id="podTitle">
  </h1>

</div>

  <section id="podInfo">
      <!-- container for podcast description -->

  </section>
  
 
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

//
// animations
//
function mainPage(e) {
  e.preventDefault();
  let containerEl = document.getElementById("main1");
  displayLoading(containerEl);
  setTimeout(() => {
    window.location.href = "./mainPage.html";
  }, 4050);
}

function displayLoading(containerEl) {
  containerEl.innerHTML = `
<div class="loadingcontainer">
      <div class="groovyLoader">
          <div>
              <div>
                  <div>
                      <div>
                          <div>
                              <div>
                                  <div>
                               
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>

`;
}
