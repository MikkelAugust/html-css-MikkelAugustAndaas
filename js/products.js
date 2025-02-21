// /js/products.js

// Function to implement fetch with retry logic
function fetchWithRetry(url, options = {}, retries = 5, delay = 2000) {
  return fetch(url, options)
    .then(response => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .catch(error => {
      if (retries > 0) {
        console.warn(`Retrying... Attempts left: ${retries}. Error: ${error}`);
        return new Promise(resolve =>
          setTimeout(() => resolve(fetchWithRetry(url, options, retries - 1, delay)), delay)
        );
      }
      throw error;
    });
}

// Function to fetch game data from the API using retry logic
function fetchGameHubData() {
  const apiUrl = "https://v2.api.noroff.dev/gamehub";
  
  return fetchWithRetry(apiUrl)
    .then(result => result.data || result)
    .then(games => {
      console.log("Fetched game data:", games);
      
      // Cache the fetched data for faster subsequent loads.
      localStorage.setItem("gameHubData", JSON.stringify(games));
      
      // Filter for the three preview games: Space War, Forge Legend, and Cyberpunk
      const previewGames = games.filter(game =>
        ["Space War", "Forge Legend", "Cyberpunk"].includes(game.title)
      );
      console.log("Preview games:", previewGames);
      
      // If no preview games found, render all games for debugging
      if (previewGames.length === 0) {
        console.log("No preview games found. Rendering all available games:");
        games.forEach(game => console.log(game.title));
        renderGamePreview(games);
      } else {
        renderGamePreview(previewGames);
      }
      return games;
    });
}

// Function to render game previews in <main>
function renderGamePreview(games) {
  const container = document.querySelector("main ul.image-container");
  if (!container) {
    console.error("Could not find the container for game images.");
    return;
  }
  
  // Clear the container's current contents
  container.innerHTML = "";
  
  // For each game, create a list item with a link and an image
  games.forEach(game => {
    const li = document.createElement("li");
    
    // Build the link that directs to the dynamic game page
    const link = document.createElement("a");
    link.href = `/game-page/game-page.html?id=${game.id}`;
    
    const img = document.createElement("img");
    img.className = "image-placeholder-container";
    img.src = (game.image && game.image.url) || "/images/default.jpg";
    img.alt = game.title;
    
    link.appendChild(img);
    li.appendChild(link);
    container.appendChild(li);
  });
}

// On DOMContentLoaded, try to render cached data first and then fetch fresh data.
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("main ul.image-container");
  if (container) {
    container.innerHTML = `<li class="loading">Loading games...</li>`;
  }
  
  // Check for cached data first
  const cachedData = localStorage.getItem("gameHubData");
  if (cachedData) {
    try {
      const games = JSON.parse(cachedData);
      console.log("Rendering cached game data.");
      // Optionally, render only the preview games from cached data:
      const previewGames = games.filter(game =>
        ["Space War", "Forge Legend", "Cyberpunk"].includes(game.title)
      );
      if (previewGames.length > 0) {
        renderGamePreview(previewGames);
      } else {
        renderGamePreview(games);
      }
    } catch (err) {
      console.error("Error parsing cached game data:", err);
    }
  }
  
  // Always fetch fresh data (which will update the UI and cache)
  fetchGameHubData().catch(error => {
    console.error("Error fetching game data:", error);
    if (container) {
      container.innerHTML = `<li class="error">Error loading games. Please try again later.</li>`;
    }
  });
});
