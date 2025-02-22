// utils.js

/**
 * Redirects the user to the home page.
 */
function redirectHome() {
    window.location.href = '/index.html';
  }
  
  /**
   * Retrieves the value of a query parameter from the URL.
   * @param {string} param - The query parameter name.
   * @returns {string|null} - The value of the parameter or null if not found.
   */
  function getQueryParameter(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }
  
  /**
   * Formats a number as a price string.
   * @param {number|string} price - The price value.
   * @returns {string} - The formatted price (e.g., "$19.99").
   */
  function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
  }
  
  /**
   * Debounces a function so that it is only executed after a specified delay has passed
   * since the last call.
   * @param {Function} func - The function to debounce.
   * @param {number} wait - The delay in milliseconds.
   * @param {boolean} immediate - If true, trigger the function on the leading edge.
   * @returns {Function} - The debounced function.
   */
  function debounce(func, wait, immediate) {
    let timeout;
    return function(...args) {
      const context = this;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  
  /**
   * Safely sets an item in localStorage.
   * @param {string} key - The key.
   * @param {any} value - The value to store (will be stringified).
   */
  function safeLocalStorageSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }
  
  /**
   * Safely gets an item from localStorage.
   * @param {string} key - The key.
   * @returns {any|null} - The parsed value or null if an error occurs.
   */
  function safeLocalStorageGet(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return null;
    }
  }
  
  // Expose these utility functions globally if needed:
  window.redirectHome = redirectHome;
  window.getQueryParameter = getQueryParameter;
  window.formatPrice = formatPrice;
  window.debounce = debounce;
  window.safeLocalStorageSet = safeLocalStorageSet;
  window.safeLocalStorageGet = safeLocalStorageGet;  