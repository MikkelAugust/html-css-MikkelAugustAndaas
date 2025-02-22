// game-search.js
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("gameSearchForm");
    const searchInput = document.getElementById("gameSearchInput");
    const searchResultsContainer = document.getElementById("gameSearchResults");
    const filterGenreCheckboxes = document.querySelectorAll('input[name="genre"]');
    const filterAgeCheckboxes = document.querySelectorAll('input[name="age"]');
    const filterYearCheckboxes = document.querySelectorAll('input[name="year"]');
  
    if (!searchResultsContainer) {
      console.error("Search results container (#gameSearchResults) not found in the HTML.");
    }
  
    // Function to get game data (from localStorage or via API fetch)
    function getGameData() {
      const cachedData = localStorage.getItem("gameHubData");
      if (cachedData) {
        try {
          return Promise.resolve(JSON.parse(cachedData));
        } catch (err) {
          console.error("Error parsing cached game data:", err);
        }
      }
      return fetch("https://v2.api.noroff.dev/gamehub")
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response not ok");
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem("gameHubData", JSON.stringify(data));
          return data;
        })
        .catch(err => {
          console.error("Error fetching game data:", err);
          return [];
        });
    }
  
    // Function to filter games based on search query and selected filters
    function filterGames(games) {
      const query = searchInput.value.trim().toLowerCase();
      const selectedGenres = Array.from(filterGenreCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value.toLowerCase());
      const selectedAges = Array.from(filterAgeCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
      const selectedYears = Array.from(filterYearCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
  
      return games.filter(game => {
        const matchesQuery = query === "" || game.title.toLowerCase().includes(query);
        const gameGenre = (game.genre || "").toLowerCase();
        const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(gameGenre);
        const gameAge = game.ageRating || "";
        const matchesAge = selectedAges.length === 0 || selectedAges.includes(gameAge);
        const gameYear = game.released ? String(game.released) : "";
        const matchesYear = selectedYears.length === 0 || selectedYears.includes(gameYear);
        return matchesQuery && matchesGenre && matchesAge && matchesYear;
      });
    }
  
    // Function to render games into the search results container (dropdown style)
    function renderSearchResults(games) {
      if (!searchResultsContainer) return;
      searchResultsContainer.innerHTML = "";
      if (games.length === 0) {
        searchResultsContainer.innerHTML = "<p>No games found.</p>";
      } else {
        games.forEach(game => {
          const resultDiv = document.createElement("div");
          resultDiv.className = "search-result";
          const gameImage = (game.image && game.image.url) ? game.image.url : "/images/default.jpg";
          resultDiv.innerHTML = `
            <div class="result-item">
              <img class="result-image" src="${gameImage}" alt="${game.title}">
              <div class="result-info">
                <h4>${game.title}</h4>
                <p>${game.description || "No description available."}</p>
                <a href="/game-page/game-page.html?id=${game.id}">View Details</a>
              </div>
            </div>
          `;
          searchResultsContainer.appendChild(resultDiv);
        });
      }
      // Ensure the results container is visible
      searchResultsContainer.style.display = "block";
    }
  
    // Listen for input events so suggestions appear immediately as you type
    searchInput.addEventListener("input", () => {
      getGameData().then(games => {
        const filtered = filterGames(games);
        renderSearchResults(filtered);
      });
    });
  
    // Also show suggestions when the search input is focused (if text exists)
    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim() !== "") {
        getGameData().then(games => {
          const filtered = filterGames(games);
          renderSearchResults(filtered);
        });
      }
    });
  
    // When the search form is submitted:
    // - If no results, do nothing.
    // - If results exist, choose the top result and redirect.
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      getGameData().then(games => {
        const filtered = filterGames(games);
        if (filtered.length === 0) {
          console.log("No results found; not redirecting.");
          return;
        } else {
          const topPick = filtered[0];
          window.location.href = `/game-page/game-page.html?id=${topPick.id}`;
        }
      });
    });
  
    // Hide search results when clicking outside the search form and results container
    document.addEventListener("click", (e) => {
      if (!searchForm.contains(e.target) && !searchResultsContainer.contains(e.target)) {
        searchResultsContainer.style.display = "none";
      }
    });
  });  