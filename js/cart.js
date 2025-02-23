document.addEventListener('DOMContentLoaded', function () {
  const cartIcon = document.getElementById('cart-icon');
  const cartCountEl = document.getElementById('cartCount');
  const overlayCart = document.getElementById('overlay-cart');
  const closeBtn = document.getElementById('close-btn');
  const cartItemsContainer = document.querySelector('.listcart');
  const checkoutButton = document.querySelector('.checkout');
  
    if (overlayCart) {
      overlayCart.style.display = 'none';
    }
  
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
    function updateCartUI() {
      if (!cartItemsContainer) return;
      cartItemsContainer.innerHTML = '';
      let totalPrice = 0;
      let totalCount = 0;
  
      if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. Add some games to it!</p>';
      } else {
        cartItems.forEach(item => {
          const cartItemDiv = document.createElement('div');
          cartItemDiv.classList.add('cart-item');
  

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
  
        const totalElement = document.createElement('p');
        totalElement.classList.add('total-price');
        totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
        cartItemsContainer.appendChild(totalElement);
      }
  

      if (cartCountEl) {
        cartCountEl.textContent = totalCount;
      }
    }
  

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
    window.addToCart = addToCart;
  
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
  
    updateCartUI();
    attachQuantityListeners();
  
    if (cartIcon) {
      cartIcon.addEventListener('click', function (event) {
        event.preventDefault();
        if (overlayCart) overlayCart.style.display = 'block';
      });
    }
  
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (overlayCart) overlayCart.style.display = 'none';
      });
    }
    
    if (overlayCart) {
      overlayCart.addEventListener('click', function (event) {
        if (event.target === overlayCart) {
          overlayCart.style.display = 'none';
        }
      });
    }
  
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