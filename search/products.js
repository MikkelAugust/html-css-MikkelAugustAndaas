document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("product-container");
  
    if (!productContainer) {
      console.error("Error: Product container not found.");
      return;
    }
  
    // Define the featured game IDs (adjust these if needed)
    const featuredIds = ["4", "5", "9"];
  
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch("/games.json");
        if (!response.ok) {
          throw new Error("Failed to load products.");
        }
        const data = await response.json();
        // Filter products to only include the featured ones
        const featuredProducts = data.data.filter(product =>
          featuredIds.includes(product.id)
        );
        renderProducts(featuredProducts);
      } catch (error) {
        console.error("Fetch error:", error);
        productContainer.innerHTML = `<li class="error">Error loading products: ${error.message}</li>`;
      }
    }
  
    function renderProducts(products) {
      productContainer.innerHTML = "";
      if (products.length === 0) {
        productContainer.innerHTML = "<li>No featured products found.</li>";
        return;
      }
  
      products.forEach((product) => {
        const li = document.createElement("li");
        li.className = "product-card";
  
        // Generate a slug from the product title and construct the game page link.
        const slug = product.title.replace(/\s+/g, '').toLowerCase();
        const link = `/games/${slug}/index.html`;
  
        li.innerHTML = `
          <img src="${product.image.url}" alt="${product.image.alt}" class="product-image" />
          <h3>${product.title}</h3>
          <p>Price: $${product.price.toFixed(2)}</p>
          <button class="view-product" data-id="${product.id}">View Details</button>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productContainer.appendChild(li);
  
        // "View Details" button: Redirect to the game's dedicated page.
        li.querySelector(".view-product").addEventListener("click", () => {
          window.location.href = link;
        });
  
        // "Add to Cart" button: Adds the product to local storage.
        li.querySelector(".add-to-cart").addEventListener("click", () => {
          addToCart(product);
        });
      });
    }
  
    // Simple Add-to-Cart function (alert removed)
    function addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      // Alert message removed; you can optionally update the UI to indicate success.
    }
  
    // Initialize: Fetch and display the featured products
    fetchFeaturedProducts();
  });
  