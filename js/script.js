document.addEventListener("DOMContentLoaded", () => {
  
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
  
  const signUpForm = document.getElementById("signupForm");
  if (signUpForm) {
    signUpForm.addEventListener("submit", handleSignUp);
  }
  

  const logoutButton = document.querySelector(".logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
  

  updateUIForLoginState();
  

if (localStorage.getItem("loggedInUser")) {
    fetchGameHubData();
  }
});

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful!");
    updateUIForLoginState(); 
    fetchGameHubData();

    const gameContainer = document.getElementById("gameContainer");
    if (gameContainer) gameContainer.style.display = "block";

    redirectHome();
  } else {
    alert("Invalid email or password");
  }
}

function handleSignUp(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  

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
  updateUIForLoginState();
  fetchGameHubData();

  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) gameContainer.style.display = "block";

  redirectHome();
}

function handleLogout() {

  localStorage.removeItem("loggedInUser");
  alert("Logged out!");
  updateUIForLoginState();

  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) gameContainer.style.display = "none";

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
    if (socialTrigger) socialTrigger.style.display = "block";
  } else {
    if (loggedOutDiv) loggedOutDiv.style.display = "block";
    if (loggedInDiv) loggedInDiv.style.display = "none";
    if (socialTrigger) socialTrigger.style.display = "none";
  }
}