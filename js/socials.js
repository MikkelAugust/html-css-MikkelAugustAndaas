document.addEventListener("DOMContentLoaded", function () {

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  void toast.offsetWidth;
  toast.classList.add("active");

  setTimeout(() => {
    toast.classList.remove("active");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

window.capitalizeFirstLetter = capitalizeFirstLetter;
window.showToast = showToast;
});