document.addEventListener('DOMContentLoaded', function () {
    // Required HTML elements (ensure these exist in your markup):
    const cartIcon = document.getElementById('cart-icon');
    const overlayCart = document.getElementById('overlay-cart');
    const closeBtn = document.getElementById('close-btn');
    const cartItemsContainer = document.querySelector('.listcart');
    const checkoutButton = document.querySelector('.checkout');
    const cartCountEl = document.getElementById('cartCount');
    
    // Ensure the cart overlay is hidden on page load
    if (overlayCart) {
        overlayCart.style.display = 'none';
    }
    
    // Retrieve the cart from localStorage, or initialize as an empty array
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Function to update the cart UI and cart count in the overlay
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
    
                // Ensure there's a valid image URL or fallback to a default image
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
    
            // Create and append a total price element
            const totalElement = document.createElement('p');
            totalElement.classList.add('total-price');
            totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
            cartItemsContainer.appendChild(totalElement);
        }
    
        // Update the cart count in the nav cart icon, if it exists
        if (cartCountEl) {
            cartCountEl.textContent = totalCount;
        }
    
        // Attach event listeners to increase quantity
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function () {
                const gameId = this.getAttribute('data-id');
                const game = cartItems.find(item => item.id === gameId);
                if (game) {
                    game.quantity++;
                    localStorage.setItem('cart', JSON.stringify(cartItems));
                    updateCartUI();
                }
            });
        });
    
        // Attach event listeners to decrease quantity
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
            });
        });
    }
    
    // Function to add a game to the cart
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
    
    // Function to set up the game page (assumes a button with class "button1" exists)
    function setupGamePage(games) {
        const addToCartButton = document.querySelector('.button1');
        if (!addToCartButton) return;
        addToCartButton.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent event bubbling that might trigger overlay opening
            const gameId = this.id;
            const game = games.find(game => game.id.toString() === gameId);
            if (game) addToCart(game);
        });
    }
    
    // Fetch game data and set up the page
    fetch('/games.json')
        .then(response => response.json())
        .then(data => {
            setupGamePage(data.data);
            updateCartUI();
        })
        .catch(error => console.error('Error loading the games:', error));
    
    // Cart overlay behavior: open only when the cart icon is clicked
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
    
    updateCartUI();
    
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
    
    // Sign-up form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
    
            // Validate passwords
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }
    
            // Save user to localStorage
            const user = { username, email, password };
            localStorage.setItem('user', JSON.stringify(user));
            alert('Sign-up successful!');
            window.location.href = '/index.html';
        });
    }
    
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const storedUser = JSON.parse(localStorage.getItem('user'));
    
            if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
                alert('Invalid email or password.');
                return;
            }
            alert('Login successful!');
            window.location.href = '/index.html';
        });
    }
});
