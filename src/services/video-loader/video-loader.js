var SERVER_ENDPOINT = window["EAM_ENDPOINT"] || "https://ether-ads-market.herokuapp.com";

function loadCSS() {
  var e = document.createElement("link");
  e.setAttribute("rel", "stylesheet");
  e.setAttribute("type", "text/css");
  e.setAttribute("href", "https://vjs.zencdn.net/7.5.4/video-js.css");
  document.head.appendChild(e);
};

function loadVideoJS(onload) {
  var scp = document.createElement("script");
  scp.src = "https://cdnjs.cloudflare.com/ajax/libs/video.js/6.4.0/video.js";
  scp.onload = function () {
    var scp1 = document.createElement("script");
    scp1.src = "https://cdnjs.cloudflare.com/ajax/libs/videojs-youtube/2.6.0/Youtube.min.js";
    scp1.onload = function () { onload(); };
    document.body.appendChild(scp1);
  };
  document.body.appendChild(scp);
};

function showPlayer() {
  var p = document.getElementById("videoContainer");
  p.style.height = "";
  p.style.width = "40%";
}

function hidePlayer() {
  var p = document.getElementById("videoContainer");
  p.style.height = "1px";
  p.style.width = "0";
}

function newAuction(testId = 1) {
  console.log("auction type " + testId + " started!");
  fetch(SERVER_ENDPOINT + "/api/v1/demo/" + testId).then(res => {
    if (res.headers.get("content-type").startsWith("application/json") && res.ok)
      return res.json();
    return { message: undefined };
  }).then(({ message: videoContent }) => {
    console.log("auction completed!");
    showPlayer();
    if (!videoContent)
      throw Error("auction Failed");
    var player = window["videojs"].players["videoPlayer"];
    player.src({ src: videoContent, type: "video/youtube" });
    // player.muted(true);
    player.play();
  }).catch(e => console.log("auction Failed!", e));
}

function initVideoPlayer() {
  window["videojs"]("videoPlayer").ready(function () {
    var player = this;
    player.src({ src: "https://www.youtube.com/watch?v=NpEaa2P7qZI", type: "video/youtube" });
    player.fluid(true);
    player.on("ended", () => { hidePlayer(); newAuction(); });
  });
};

function addAuctionButton(videoContainer, testId, title) {
  var auctionBtn = document.createElement("button");
  auctionBtn.innerText = title;
  auctionBtn.addEventListener("click", () => newAuction(testId));
  videoContainer.appendChild(auctionBtn);
};

/* like document.querySelectorAll but with priority */
function querySelectorAllPrioritize(posSelector) {
  for (let selector of posSelector.split(",")) {
    let posElement = document.querySelector(selector);
    if (posElement)
      return posElement;
  }
  return document.body;
};

function addVideoContainer() {
  var videoContainer = document.createElement("div");
  videoContainer.id = "videoContainer";
  videoContainer.style.width = "40%";
  var videoPlayer = document.createElement("video");
  videoPlayer.id = "videoPlayer";
  videoPlayer.setAttribute("class", "video-js");
  addAuctionButton(videoContainer, 1, "New Regular Auction");
  addAuctionButton(videoContainer, 2, "New Reseller Auction");
  videoContainer.appendChild(videoPlayer);
  var element = querySelectorAllPrioritize(window["EAM_SELECTOR"] || "body");
  element.insertBefore(videoContainer, element.firstChild);
};

function main() {
  loadCSS();
  addVideoContainer();
  loadVideoJS(function () {
    initVideoPlayer();
    newAuction();
  });
}

main();
