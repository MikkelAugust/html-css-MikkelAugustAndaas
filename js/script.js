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
  
  // Social overlay functionality is handled in socialoverlay.js

  updateUIForLoginState();
  
  // If a user is already logged in, fetch game data
  if (localStorage.getItem("loggedInUser")) {
    fetchGameHubData();
  }
});

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
    updateUIForLoginState(); // Update UI immediately
    // Fetch game data after login
    fetchGameHubData();
    // Show the game container if it was hidden
    const gameContainer = document.getElementById("gameContainer");
    if (gameContainer) gameContainer.style.display = "block";
    // Redirect to home page
    redirectHome();
  } else {
    alert("Invalid email or password");
  }
}

function handleSignUp(e) {
  e.preventDefault(); // Prevent form refresh
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
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
  updateUIForLoginState(); // Update UI immediately
  // Fetch game data after sign-up
  fetchGameHubData();
  // Show the game container if it was hidden
  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) gameContainer.style.display = "block";
  // Redirect to home page
  redirectHome();
}

function handleLogout() {
  // Remove the logged in user from localStorage
  localStorage.removeItem("loggedInUser");
  alert("Logged out!");
  updateUIForLoginState();
  // Hide the game container after logout
  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) gameContainer.style.display = "none";
  // Redirect to homepage
  redirectHome();
}

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