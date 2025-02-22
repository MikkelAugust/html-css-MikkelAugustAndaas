document.addEventListener('DOMContentLoaded', function () {
    // Required HTML elements:
    const cartIcon = document.getElementById('cart-icon');         // Cart icon in your header
    const cartCountEl = document.getElementById('cartCount');        // Element to show the cart item count
    const overlayCart = document.getElementById('overlay-cart');     // Cart overlay container
    const closeBtn = document.getElementById('close-btn');           // Button to close the cart overlay
    const cartItemsContainer = document.querySelector('.listcart');  // Container to list cart items
    const checkoutButton = document.querySelector('.checkout');      // Checkout button inside the overlay
  
    // Ensure the cart overlay is hidden on page load
    if (overlayCart) {
      overlayCart.style.display = 'none';
    }
  
    // Retrieve the cart from localStorage, or initialize as an empty array
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Update the cart UI (cart items list and header count)
    function updateCartUI() {
      if (!cartItemsContainer) return;
      cartItemsContainer.innerHTML = ''; // Clear current content
      let totalPrice = 0;
      let totalCount = 0;
  
      if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. Add some games to it!</p>';
      } else {
        cartItems.forEach(item => {
          const cartItemDiv = document.createElement('div');
          cartItemDiv.classList.add('cart-item');
  
          // Use a valid image URL or fallback to a default image
          const imageUrl = item.image && item.image.url ? item.image.url : '/images/default.jpg';
  
          cartItemDiv.innerHTML = `
            <img src="${imageUrl}" alt="${item.image ? item.image.alt : 'Game cover'}" class="cart-item-image">
            <div class="cart-item-details">
              <p>${item.title}</p>
              <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
              <button class="quantity-btn minus" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
          `;
          cartItemsContainer.appendChild(cartItemDiv);
          totalPrice += item.price * item.quantity;
          totalCount += item.quantity;
        });
  
        // Append a total price element
        const totalElement = document.createElement('p');
        totalElement.classList.add('total-price');
        totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
        cartItemsContainer.appendChild(totalElement);
      }
  
      // Update the cart count element in the header/UI
      if (cartCountEl) {
        cartCountEl.textContent = totalCount;
      }
    }
  
    // Global function to add a game to the cart
    function addToCart(game) {
      const existingGame = cartItems.find(item => item.id === game.id);
      if (existingGame) {
        existingGame.quantity++;
      } else {
        cartItems.push({ ...game, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cartItems));
      updateCartUI();
    }
    window.addToCart = addToCart; // Expose globally for usage on game pages
  
    // Attach event listeners to quantity buttons (update cart on plus/minus)
    function attachQuantityListeners() {
      document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function () {
          const gameId = this.getAttribute('data-id');
          const game = cartItems.find(item => item.id === gameId);
          if (game) {
            game.quantity++;
            localStorage.setItem('cart', JSON.stringify(cartItems));
            updateCartUI();
            attachQuantityListeners();
          }
        });
      });
  
      document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function () {
          const gameId = this.getAttribute('data-id');
          const game = cartItems.find(item => item.id === gameId);
          if (game && game.quantity > 1) {
            game.quantity--;
          } else {
            cartItems = cartItems.filter(item => item.id !== gameId);
          }
          localStorage.setItem('cart', JSON.stringify(cartItems));
          updateCartUI();
          attachQuantityListeners();
        });
      });
    }
  
    // Initial UI update on page load
    updateCartUI();
    attachQuantityListeners();
  
    // Open cart overlay when the cart icon is clicked
    if (cartIcon) {
      cartIcon.addEventListener('click', function (event) {
        event.preventDefault();
        if (overlayCart) overlayCart.style.display = 'block';
      });
    }
  
    // Close cart overlay when the close button is clicked
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (overlayCart) overlayCart.style.display = 'none';
      });
    }
    
    // Close cart overlay when clicking outside its inner content
    if (overlayCart) {
      overlayCart.addEventListener('click', function (event) {
        if (event.target === overlayCart) {
          overlayCart.style.display = 'none';
        }
      });
    }
  
    // Checkout button behavior
    if (checkoutButton) {
      checkoutButton.addEventListener('click', function (event) {
        if (cartItems.length === 0) {
          alert("Your cart is empty. Add some games before proceeding to checkout.");
          event.preventDefault();
        } else {
          window.location.href = '/checkout-page/checkout-page.html';
        }
      });
    }
  });