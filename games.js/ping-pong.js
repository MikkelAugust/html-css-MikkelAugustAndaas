document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cart-icon");
    const closeBtn = document.getElementById("close-btn");
    const overlayCart = document.getElementById("overlay-cart");
    const overlayList = document.querySelector(".overlay-list");
    const overlayTotal = document.querySelector(".overlay-total");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    const orderButton = document.querySelector(".add-to-cart");

    // Array to store cart data
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to add an item to the cart
    const addToCart = (image, price) => {
        const existingItem = cart.find(item => item.image === image);
        if (existingItem) {
            existingItem.quantity += 1; // Increase quantity if item already in cart
        } else {
            cart.push({ image, price: parseFloat(price), quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Save to localStorage
        updateCartOverlay();
    };

    // Function to update the cart overlay
    const updateCartOverlay = () => {
        overlayList.innerHTML = ""; // Clear previous items
        let total = 0;

        // Populate cart overlay
        cart.forEach(item => {
            const listItem = document.createElement("div");
            listItem.classList.add("cart-item");
            listItem.innerHTML = `
                <div class="cart-item-details">
                    <img src="/images/${item.image}" alt="Cart Item" class="cart-item-image">
                    <p class="cart-item-text">Price: $${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease" data-image="${item.image}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase" data-image="${item.image}">+</button>
                </div>
            `;
            overlayList.appendChild(listItem);
            total += item.price * item.quantity;
        });

        // Update total price
        overlayTotal.textContent = `Total: $${total.toFixed(2)}`;
    };

    // Event listener for "Order Now" button
    orderButton.addEventListener("click", () => {
        const image = "ping-pong.jpg"; // Replace with dynamic data if needed
        const price = 16.99; // Replace with dynamic data if needed
        addToCart(image, price);
    });

    // Increase item quantity
    overlayList.addEventListener("click", (e) => {
        if (e.target.classList.contains("increase")) {
            const image = e.target.dataset.image;
            const item = cart.find(item => item.image === image);
            if (item) item.quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartOverlay();
        }

        // Decrease item quantity
        if (e.target.classList.contains("decrease")) {
            const image = e.target.dataset.image;
            const item = cart.find(item => item.image === image);
            if (item && item.quantity > 1) item.quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartOverlay();
        }
    });

    // Clear Cart functionality
    clearCartBtn.addEventListener("click", () => {
        cart.length = 0; // Clear all items in the cart array
        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        updateCartOverlay(); // Update the overlay to reflect changes
    });

    // Open the cart overlay
    cartIcon.addEventListener("click", () => {
        overlayCart.style.display = "block";
    });

    // Close the cart overlay
    closeBtn.addEventListener("click", () => {
        overlayCart.style.display = "none";
    });

    // Load the cart from localStorage on page load
    updateCartOverlay();
});