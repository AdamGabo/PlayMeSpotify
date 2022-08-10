// How to use renderAudioPlayer function; call the function with parameter source and container element
// Input : 1. Source = A url to the audio file to be loaded. 2. class = The class you want to give to the audio element  3. An element in which to append this player.
// output : 2. The function will append the audio tag in the element passed as parameter.

function renderAudioPlayer(src, clss, audioContainerEl) {
  let player = document.createElement("AUDIO");
  player.src = src;
  player.classList = clss;
  player.controls = "controls";
  player.prelaod = "metadata";
  audioContainerEl.appendChild(player);
}
