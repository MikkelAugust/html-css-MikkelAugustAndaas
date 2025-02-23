// pop-up.js
(function() {
  // Create container for toast messages and assign a CSS class
  const container = document.createElement('div');
  container.classList.add('toast-container');
  document.body.appendChild(container);

  /**
   * Display a toast message.
   *
   * @param {string} message - The message to display.
   * @param {string} type - The type of message ("error", "success", "warning", or "info").
   * @param {number} duration - Duration in milliseconds before the toast fades out.
   */
  window.showToast = function(message, type = 'info', duration = 3000) {
    // Create the toast element and add the type as a class
    const toast = document.createElement('div');
    toast.classList.add('toast-message', type);
    toast.textContent = message;
    
    // Append the toast to the container
    container.appendChild(toast);

    // Trigger CSS animation by adding the 'show' class
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    // Remove the toast after the specified duration
    setTimeout(() => {
      toast.classList.remove('show');
      // Remove toast from DOM after transition ends
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 500);
    }, duration);
  };
})();
