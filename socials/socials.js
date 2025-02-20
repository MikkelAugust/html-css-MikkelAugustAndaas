document.addEventListener("DOMContentLoaded", function () {
    // Get references to the overlay elements
    const openSocialOverlay = document.getElementById("openSocialOverlay");
    const socialOverlay = document.getElementById("socialOverlay");
    const closeSocialOverlay = document.getElementById("closeSocialOverlay");
  
    // Get references to tab buttons and content areas
    const tabButtons = document.querySelectorAll(".social-tab");
    const tabContents = document.querySelectorAll(".social-content");
  
    // Function to activate a given tab by name
    function activateTab(tabName) {
      tabButtons.forEach(btn => {
        if (btn.getAttribute("data-tab") === tabName) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
      tabContents.forEach(content => {
        if (content.id === "social" + capitalizeFirstLetter(tabName)) {
          content.style.display = "block";
          content.classList.add("active");
        } else {
          content.style.display = "none";
          content.classList.remove("active");
        }
      });
    }
  
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
  
    // Event listener: Open overlay (with login check)
    openSocialOverlay.addEventListener("click", function () {
      if (!localStorage.getItem("loggedInUser")) {
        showToast("Please log in to access the Social Hub.");
        // Optionally, you could redirect to the login page:
        // window.location.href = "/login/login.html";
        return;
      }
      socialOverlay.style.display = "block";
      activateTab("profiles"); // Set default tab
    });
  
    // Event listener: Close overlay when close button is clicked
    closeSocialOverlay.addEventListener("click", function () {
      socialOverlay.style.display = "none";
    });
  
    // Event listener: Close overlay if clicking outside the inner content
    window.addEventListener("click", function (event) {
      if (event.target === socialOverlay) {
        socialOverlay.style.display = "none";
      }
    });
  
    // Event listeners for tab buttons
    tabButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const tab = this.getAttribute("data-tab");
        activateTab(tab);
      });
    });
  });
  