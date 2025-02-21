// /js/library.js
import { fetchGameData } from '/js/api.js';

function renderLibraryGames(games) {
  // Select the container for game boxes.
  const container = document.querySelector('.library-image-grid');
  if (!container) {
    console.error("Could not find '.library-image-grid' container.");
    return;
  }
  
  // Clear any existing content.
  container.innerHTML = "";
  
  games.forEach(game => {
    // Create a game box.
    const gameBox = document.createElement('div');
    gameBox.classList.add('game-box');
    
    // Create a clickable link.
    const link = document.createElement('a');
    // This is the key line: the link includes the game id in the URL.
    link.href = `/game-page/game-page.html?id=${game.id}`;
    
    // Create the game image.
    const img = document.createElement('img');
    img.classList.add('library-image-placeholder');
    img.src = (game.image && game.image.url) || '/images/default.jpg';
    img.alt = game.title;
    
    // Append the image to the link and the link to the game box.
    link.appendChild(img);
    gameBox.appendChild(link);
    
    // Create and add the game title.
    const titleEl = document.createElement('h3');
    titleEl.textContent = game.title;
    gameBox.appendChild(titleEl);
    
    // Create and add the price information.
    const priceEl = document.createElement('p');
    priceEl.textContent = game.onSale ? `$${game.discountedPrice}` : `$${game.price}`;
    gameBox.appendChild(priceEl);
    
    // Append the game box to the grid container.
    container.appendChild(gameBox);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchGameData()
    .then(games => renderLibraryGames(games))
    .catch(err => console.error("Error fetching library games:", err));
});