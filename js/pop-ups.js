(function() {

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

    const toast = document.createElement('div');
    toast.classList.add('toast-message', type);
    toast.textContent = message;
    

    container.appendChild(toast);


    setTimeout(() => {
      toast.classList.add('show');
    }, 100);


    setTimeout(() => {
      toast.classList.remove('show');

      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 500);
    }, duration);
  };
})
();