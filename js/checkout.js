// /js/checkout.js
document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutCartItems = document.getElementById('checkoutCartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const orderSummary = document.getElementById('orderSummary');
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to update the order summary display
    function updateOrderSummary() {
        if (!checkoutCartItems) return;
        
        if (cartItems.length === 0) {
            checkoutCartItems.innerHTML = '<p>Your cart is empty.</p>';
            totalPriceElement.textContent = '0.00';
            orderSummary.style.display = 'none';
        } else {
            let total = 0;
            checkoutCartItems.innerHTML = '';
            cartItems.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');

                // Create an image element for the cart item
                const img = document.createElement('img');
                img.src = (item.image && item.image.url) || '/images/default.jpg';
                img.alt = item.title;
                img.className = 'cart-item-image';

                // Create a container for item details
                const detailsDiv = document.createElement('div');
                detailsDiv.classList.add('cart-item-details');
                detailsDiv.innerHTML = `
                    <p>${item.title}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.price.toFixed(2)}</p>
                `;

                cartItemDiv.appendChild(img);
                cartItemDiv.appendChild(detailsDiv);
                checkoutCartItems.appendChild(cartItemDiv);

                total += item.price * item.quantity;
            });
            totalPriceElement.textContent = total.toFixed(2);
            orderSummary.style.display = 'block';
        }
    }

    // Update the order summary on page load
    updateOrderSummary();

    // Handle checkout form submission
    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const fullName = document.getElementById('shippingName').value.trim();
        const shippingAddress = document.getElementById('shippingAddress').value.trim();
        const paymentMethod = document.getElementById('paymentMethod').value;

        if (!fullName || !shippingAddress) {
            alert('Please fill out all fields.');
            return;
        }

        // Simulate order completion
        alert(`Order placed successfully! We will send your order to ${fullName} at ${shippingAddress} using ${paymentMethod}.`);

        // Clear the cart
        localStorage.removeItem('cart');
        // Update the order summary to reflect an empty cart
        updateOrderSummary();
        // Redirect to homepage or order confirmation page
        window.location.href = '/index.html';
    });
});
