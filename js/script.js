// script.js

// Fetch game data from the Noroff API (no headers required)
function fetchGameHubData() {
  fetch("https://v2.api.noroff.dev/gamehub")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Fetched game hub data:", data);
      // Optionally store the data in localStorage if needed:
      localStorage.setItem("gameHubData", JSON.stringify(data));
      // Render the game data on the page
      renderGameHubData(data);
    })
    .catch(error => {
      console.error("Error fetching game hub data:", error);
    });
}

// Function to render game data (for example, as game cards)
// Assumes your HTML has a container element with id="gameContainer"
function renderGameHubData(games) {
  const container = document.getElementById("gameContainer");
  if (!container) {
    console.error("No container with id 'gameContainer' found.");
    return;
  }
  
  // Clear any previous content
  container.innerHTML = "";
  
  // Create a simple card or link for each game
  games.forEach(game => {
    const gameCard = document.createElement("div");
    gameCard.className = "game-card";
    
    // Example content: game title, description, and a link to a details page (if needed)
    gameCard.innerHTML = `
      <h3>${game.title}</h3>
      <p>${game.description || "No description available."}</p>
      <a href="game-details.html?id=${game.id}">View Details</a>
    `;
    
    container.appendChild(gameCard);
  });
}

/* ------------------- LOGIN FUNCTION ------------------- */
function handleLogin(e) {
  e.preventDefault(); // Prevent form refresh
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  // Retrieve stored users from localStorage (if any)
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful!");
    // Fetch game data after login
    fetchGameHubData();
    // Optionally show the game container if it was hidden
    const gameContainer = document.getElementById("gameContainer");
    if (gameContainer) gameContainer.style.display = "block";
  } else {
    alert("Invalid email or password");
  }
}

/* ------------------- SIGN-UP FUNCTION ------------------- */
function handleSignUp(e) {
  e.preventDefault(); // Prevent form refresh
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  // Validate that the email ends with @stud.noroff.no
  if (!email.endsWith("@stud.noroff.no")) {
    alert("Email must end with @stud.noroff.no");
    return;
  }
  
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  
  // Retrieve any existing users from localStorage
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some(u => u.email === email)) {
    alert("Email already registered");
    return;
  }
  
  const newUser = { username, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", JSON.stringify(newUser));
  alert("Sign up successful!");
  
  // Fetch game data after sign-up
  fetchGameHubData();
  // Optionally show the game container if it was hidden
  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) gameContainer.style.display = "block";
}

/* ------------------- LOGOUT FUNCTION ------------------- */
function handleLogout() {
  // Remove the logged in user from localStorage
  localStorage.removeItem("loggedInUser");
  alert("Logged out!");
  // Update UI for logged-out state
  updateUIForLoginState();
  // Optionally hide the game container after logout
  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) gameContainer.style.display = "none";
  // Redirect to homepage to enforce logged-out state
  window.location.href = "/index.html";
}

/* ------------------- UPDATE UI FUNCTION ------------------- */
function updateUIForLoginState() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedOutDiv = document.getElementById("loggedOutButtons");
  const loggedInDiv = document.getElementById("loggedInButtons");
  const socialTrigger = document.querySelector(".header-social");
  
  if (loggedInUser) {
    if (loggedOutDiv) loggedOutDiv.style.display = "none";
    if (loggedInDiv) loggedInDiv.style.display = "block";
    if (socialTrigger) socialTrigger.style.display = "block"; // Show social trigger when logged in
  } else {
    if (loggedOutDiv) loggedOutDiv.style.display = "block";
    if (loggedInDiv) loggedInDiv.style.display = "none";
    if (socialTrigger) socialTrigger.style.display = "none";  // Hide social trigger when not logged in
  }
}

/* ------------------- DOMContentLoaded ------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Attach login and sign-up event listeners
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
  
  const signUpForm = document.getElementById("signupForm");
  if (signUpForm) {
    signUpForm.addEventListener("submit", handleSignUp);
  }
  
  // Attach logout event listener if the logout button exists
  const logoutButton = document.querySelector(".logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
  
  // Social overlay functionality
  const openSocialOverlay = document.getElementById("openSocialOverlay");
  const socialOverlay = document.getElementById("socialOverlay");
  const closeSocialOverlay = document.getElementById("closeSocialOverlay");
  
  if (openSocialOverlay && socialOverlay && closeSocialOverlay) {
    openSocialOverlay.addEventListener("click", () => {
      socialOverlay.style.display = "block";
    });
    
    closeSocialOverlay.addEventListener("click", () => {
      socialOverlay.style.display = "none";
    });
    
    window.addEventListener("click", event => {
      if (event.target === socialOverlay) {
        socialOverlay.style.display = "none";
      }
    });
  }
  
  updateUIForLoginState();
  
  // If a user is already logged in, fetch game data
  if (localStorage.getItem("loggedInUser")) {
    fetchGameHubData();
  }
});