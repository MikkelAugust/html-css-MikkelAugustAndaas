import { fetchGameData } from '/js/api.js';

document.addEventListener("DOMContentLoaded", () => {
  // Extract the game id from the URL query string (e.g., ?id=26594301-ad8e-4691-a2ca-c774f50b1b21)
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('id');
  console.log("Game id from URL:", gameId);
  
  if (!gameId) {
    console.error("No game id specified in the URL.");
    return;
  }

  // Fetch game data from the API.
  fetchGameData()
    .then(games => {
      console.log("Fetched games:", games);
      // Find the game with the matching id.
      const game = games.find(g => g.id === gameId);
      if (!game) {
        console.error("Game not found for id:", gameId);
        return;
      }
      console.log("Found game:", game);
      
      // Update the game title.
      const titleEl = document.querySelector('.gametitle');
      if (titleEl) {
        titleEl.textContent = game.title;
      }

      // Update the game description.
      const textEl = document.querySelector('.gametext');
      if (textEl) {
        textEl.textContent = game.description;
      }

      // Update the game cover image.
      const coverImg = document.querySelector('.game-cover-container img.gamecover');
      if (coverImg) {
        coverImg.src = (game.image && game.image.url) || '/images/default-game-cover.jpg';
        coverImg.alt = `${game.title} Game Cover`;
      }

      // Update the game details list.
      const detailsList = document.querySelector('.game-details ul');
      if (detailsList) {
        detailsList.innerHTML = ""; // Clear existing details.
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

      // Update the order button with the game id and attach an add-to-cart handler.
      const orderButton = document.querySelector('.ordernow button');
      if (orderButton) {
        // Save the game id in a data attribute (optional)
        orderButton.dataset.gameId = game.id;
        orderButton.addEventListener('click', () => {
          // Call the addToCart function defined in cart.js (ensure it's available globally)
          if (typeof addToCart === 'function') {
            addToCart(game);
            alert("Added to cart!");
          } else {
            console.error("addToCart function not available");
          }
        });
      }
    })
    .catch(error => {
      console.error("Error fetching game data:", error);
    });
});