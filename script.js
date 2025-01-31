const cartIcon = document.getElementById('cart-icon');
const overlayCart = document.getElementById('overlay-cart');
const closeBtn = document.getElementById('close-btn');

// Show the overlay cart when clicking the cart icon
cartIcon.addEventListener('click', () => {
    overlayCart.style.display = 'flex'; // Display overlay
});

// Close the overlay cart when clicking the close button
closeBtn.addEventListener('click', () => {
    overlayCart.style.display = 'none'; // Hide overlay
});

if (cartItems.length === 0) {
    document.querySelector('.empty-cart-message').style.display = 'flex';
} else {
    document.querySelector('.empty-cart-message').style.display = 'none';
}