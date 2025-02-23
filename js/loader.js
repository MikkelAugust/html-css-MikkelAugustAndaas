document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.disableLoader !== "undefined" && window.disableLoader === true) {
    return;
  }

  const loadingOverlay = document.createElement("div");
  loadingOverlay.id = "loading-overlay";
  loadingOverlay.innerHTML = `
    <div id="loader">
      <div class="pixel"></div>
      <div class="pixel"></div>
      <div class="pixel"></div>
      <div class="pixel"></div>
    </div>
  `;
  document.body.appendChild(loadingOverlay);

  const style = document.createElement("style");
  style.textContent = `
    /* Full-screen overlay styling */
    #loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #121212;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      opacity: 0;
      animation: fadeIn 0.3s ease-out forwards;
    }

    /* Retro pixel spinner container */
    #loader {
      width: 64px;
      height: 64px;
      position: relative;
      animation: spin 0.8s linear infinite;
    }

    /* Four pixels positioned in a square layout */
    #loader .pixel {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #fff;
      box-shadow: 0 0 8px #fff;
      animation: pixel-flicker 0.8s infinite alternate;
    }
    #loader .pixel:nth-child(1) { top: 0; left: 0; }
    #loader .pixel:nth-child(2) { top: 0; right: 0; }
    #loader .pixel:nth-child(3) { bottom: 0; left: 0; }
    #loader .pixel:nth-child(4) { bottom: 0; right: 0; }

    /* Spinner rotation */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Pixel flicker for a dynamic retro feel */
    @keyframes pixel-flicker {
      0% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    /* Fade in/out animations for the overlay */
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(1.05); }
    }
  `;
  document.head.appendChild(style);

  window.addEventListener("load", () => {
    loadingOverlay.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => {
      if (loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    }, 300);
  });
});