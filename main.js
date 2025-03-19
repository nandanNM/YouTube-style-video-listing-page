const videosGrid = document.querySelector(".videos-grid");
const searchInput = document.querySelector(".search-bar");
let isLoading = true;
let error = "";
let videos = [];

async function loadVideos() {
  error = "";
  const url = "https://api.freeapi.app/api/v1/public/youtube/videos";
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    videos = data.data;
    // console.log(videos);
  } catch (error) {
    console.error(error.message);
    error = error.message;
  } finally {
    isLoading = false;
    showVideos(); // Call showVideos after data is loaded
  }
}

function videoCard(video) {
  const div = document.createElement("div");
  div.classList.add("video-card");
  div.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${video.items.id}">
         <div  class="thumbnail">
            <img
              src="${video.items.snippet.thumbnails.high.url}"
              alt="${video.items.snippet.title}" />
          </div>
          <div class="video-info">
            <div class="video-details">
              <h3>${video.items.snippet.title}</h3>
              <p class="channel-name">${video.items.snippet.channelTitle}</p>
              <p class="video-stats">${video.items.statistics.viewCount} views</p>
            </div>
          </div>
          </a>
  `;
  return div;
}

function showVideos() {
  if (isLoading) {
    videosGrid.innerHTML = "Loading videos...";
    return;
  }

  videosGrid.innerHTML = ""; // Clear existing content
  videos.data?.forEach((video) => {
    const card = videoCard(video);
    videosGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredVideos = {
    data: videos.data?.filter((video) =>
      video.items.snippet.title.toLowerCase().includes(searchTerm)
    ),
  };

  // Update the display with filtered results
  videosGrid.innerHTML = "";
  if (filteredVideos.data && filteredVideos.data.length > 0) {
    filteredVideos.data.forEach((video) => {
      const card = videoCard(video);
      videosGrid.appendChild(card);
    });
  } else {
    videosGrid.innerHTML = "<p>No videos found</p>";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadVideos();
});
