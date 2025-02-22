import { fetchGameData } from '/js/api.js';

let allGames = [];

// Function to dynamically generate the sidebar
function renderSidebar() {
  const sidebarContainer = document.getElementById("sidebarContainer");
  if (!sidebarContainer) return;
  const sidebar = document.createElement("aside");
  sidebar.classList.add("library-sidebar");

  // Define the categories in an array (you could also fetch these dynamically)
  const categories = ["all", "sports", "action", "adventure", "horror"];
  let html = `<h2>Categories</h2><ul>`;
  categories.forEach(category => {
    html += `<li data-category="${category}" class="${category === "all" ? "active" : ""}">${category.charAt(0).toUpperCase() + category.slice(1)}</li>`;
  });
  html += `</ul>`;
  sidebar.innerHTML = html;
  sidebarContainer.appendChild(sidebar);

  // Attach event listeners for filtering
  const sidebarItems = sidebar.querySelectorAll("ul li");
  sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
      sidebarItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const category = item.getAttribute("data-category");
      filterLibraryGames(category);
    });
  });
}

function renderLibraryGames(games) {
  const container = document.querySelector('.library-image-grid');
  if (!container) {
    console.error("Could not find '.library-image-grid' container.");
    return;
  }
  container.innerHTML = "";
  
  games.forEach(game => {
    const gameBox = document.createElement('div');
    gameBox.classList.add('game-box');
    
    const link = document.createElement('a');
    link.href = `/game-page/game-page.html?id=${game.id}`;
    
    // Image wrapper for consistent sizing
    const wrapper = document.createElement('div');
    wrapper.classList.add('library-image-wrapper');
    
    const img = document.createElement('img');
    img.classList.add('library-image-placeholder');
    img.src = (game.image && game.image.url) || '/images/default.jpg';
    img.alt = game.title;
    
    wrapper.appendChild(img);
    link.appendChild(wrapper);
    gameBox.appendChild(link);
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = game.title;
    gameBox.appendChild(titleEl);
    
    const priceEl = document.createElement('p');
    priceEl.textContent = game.onSale ? `$${game.discountedPrice}` : `$${game.price}`;
    gameBox.appendChild(priceEl);
    
    container.appendChild(gameBox);
  });
}

function filterLibraryGames(category) {
  if (category === "all") {
    renderLibraryGames(allGames);
  } else {
    const filtered = allGames.filter(game => {
      return (game.genre || "").toLowerCase() === category.toLowerCase();
    });
    renderLibraryGames(filtered);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Render sidebar dynamically
  renderSidebar();

  fetchGameData()
    .then(games => {
      allGames = games;
      renderLibraryGames(allGames);
    })
    .catch(err => console.error("Error fetching library games:", err));
});