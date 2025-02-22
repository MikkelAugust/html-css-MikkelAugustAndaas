document.addEventListener("DOMContentLoaded", function () {
  // Utility: Capitalize first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Function to show a toast error message
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    // Trigger reflow so that animation can start
    void toast.offsetWidth;
    toast.classList.add("active");
    // Remove the toast after 3 seconds, with fade-out transition
    setTimeout(() => {
      toast.classList.remove("active");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  }
  
  // Expose these functions globally if needed elsewhere
  window.capitalizeFirstLetter = capitalizeFirstLetter;
  window.showToast = showToast;
});