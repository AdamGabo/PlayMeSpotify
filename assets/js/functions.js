// How to use renderAudioPlayer function; call the function with parameter source and container element
// Input : 1. Source = A url to the audio file to be loaded. 2. class = The class you want to give to the audio element  3. An element in which to append this player.
// output : 2. The function will append the audio tag in the element passed as parameter.

function renderAudioPlayer(src, clss = "", audioContainerEl) {
  audioContainerEl.innerText = "";
  let player = document.createElement("AUDIO");
  player.src = src;
  player.classList = clss;
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
  type = "podcast",
  offset = "0",
  len_max = "240",
  published_before = moment().unix(),
  published_after = 0
) {
  input = encodeURI(input);
  let url = `https://coolspotifyproxy.herokuapp.com/${baseUrl}search?q=${input}&type=${type}&offset=${offset}&len_max=${len_max}&published_before=${published_before}published_after=${published_after}&only_in=title%2Cdescription%2Cauthordescription&language=English&safe_mode=0`;

  let response = await fetch(url);
  let json = await response.json();
  renderSearchResult(json);
}
