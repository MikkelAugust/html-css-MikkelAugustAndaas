document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutCartItems = document.getElementById('checkoutCartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const orderSummary = document.getElementById('orderSummary');
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to update the order summary
    function updateOrderSummary() {
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
                cartItemDiv.innerHTML = `
                    <p>${item.title} - ${item.quantity} x $${item.price}</p>
                `;
                checkoutCartItems.appendChild(cartItemDiv);
                total += item.price * item.quantity;
            });
            totalPriceElement.textContent = total.toFixed(2);
            orderSummary.style.display = 'block';
        }
    }

    // Update cart and order summary
    updateOrderSummary();

    // Checkout form submission handling
    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const fullName = document.getElementById('shippingName').value.trim();
        const shippingAddress = document.getElementById('shippingAddress').value.trim();
        const paymentMethod = document.getElementById('paymentMethod').value;

        if (!fullName || !shippingAddress) {
            alert('Please fill out all fields.');
            return;
        }

        // Simulate a successful order
        alert(`Order placed successfully! We will send your order to ${fullName} at ${shippingAddress} using ${paymentMethod}.`);

        // Clear the cart
        localStorage.removeItem('cart');
        window.location.href = '/index.html'; // Redirect to homepage
    });
});
