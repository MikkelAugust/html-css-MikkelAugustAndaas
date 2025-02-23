import { fetchGameData } from '/js/api.js';

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('id');
  console.log("Game id from URL:", gameId);
  
  if (!gameId) {
    console.error("No game id specified in the URL.");
    if (window.showToast) {
      showToast("Error: No game id specified in the URL.", "error");
    }
    return;
  }


  fetchGameData()
    .then(games => {
      console.log("Fetched games:", games);
      const game = games.find(g => g.id === gameId);
      if (!game) {
        console.error("Game not found for id:", gameId);
        if (window.showToast) {
          showToast("Error: Game not found. Refreshing...", "error");
        }
        setTimeout(() => window.location.reload(), 3000);
        return;
      }
      console.log("Found game:", game);
      const titleEl = document.querySelector('.gametitle');
      if (titleEl) {
        titleEl.textContent = game.title;
      }

      const textEl = document.querySelector('.gametext');
      if (textEl) {
        textEl.textContent = game.description;
      }

      const coverImg = document.querySelector('.game-cover-container img.gamecover');
      if (coverImg) {
        coverImg.src = (game.image && game.image.url) || '/images/default-game-cover.jpg';
        coverImg.alt = `${game.title} Game Cover`;
      }

      const detailsList = document.querySelector('.game-details ul');
      if (detailsList) {
        detailsList.innerHTML = "";
        const details = [
          { label: "Genre", value: game.genre },
          { label: "Released", value: game.released },
          { label: "Age Rating", value: game.ageRating },
          { label: "Price", value: game.onSale ? `$${game.discountedPrice}` : `$${game.price}` }
        ];
        details.forEach(detail => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
          detailsList.appendChild(li);
        });
      }

      const orderButton = document.querySelector('.ordernow button');
      if (orderButton) {
        orderButton.dataset.gameId = game.id;
        orderButton.addEventListener('click', () => {
          if (typeof addToCart === 'function') {
            addToCart(game);
            if (window.showToast) {
              showToast("Added to cart!", "success", 2000);
            }
          } else {
            console.error("addToCart function not available");
            if (window.showToast) {
              showToast("Error: Unable to add game to cart.", "error", 2000);
            }
          }
        });
      }
    })
    .catch(error => {
      console.error("Error fetching game data:", error);
      if (window.showToast) {
        showToast("Error fetching game data. Refreshing...", "error");
      }
      // Auto-refresh after 3 seconds if there's an error fetching the data
      setTimeout(() => window.location.reload(), 3000);
    });
});