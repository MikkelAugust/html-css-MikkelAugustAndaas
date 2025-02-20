// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Attach login event listener if the login form exists
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin);
    }
  
    // Attach sign-up event listener if the sign-up form exists
    const signUpForm = document.getElementById("signupForm");
    if (signUpForm) {
      signUpForm.addEventListener("submit", handleSignUp);
    }
  
    // Attach logout event listener if a logout button exists
    const logoutButton = document.querySelector(".logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", handleLogout);
    }
  
    // Update UI based on login state
    updateUIForLoginState();
  });
  
  /* ------------------- LOGIN FUNCTION ------------------- */
  function handleLogin(e) {
    e.preventDefault(); // Stop form submission refresh
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Retrieve the stored users from localStorage (if any)
    const users = JSON.parse(localStorage.getItem("users") || "[]");
  
    // Check if user exists and if the password is correct
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      // Save logged in user data to localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      alert("Login successful!");
      // Redirect to home page (update URL if needed)
      window.location.href = "/index.html";
    } else {
      alert("Invalid email or password");
    }
  }
  
  /* ------------------- SIGN-UP FUNCTION ------------------- */
  function handleSignUp(e) {
    e.preventDefault(); // Prevent page refresh
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    // Get any existing users from localStorage
    let users = JSON.parse(localStorage.getItem("users") || "[]");
  
    // Check if the email is already registered
    if (users.some(u => u.email === email)) {
      alert("Email already registered");
      return;
    }
  
    // Create a new user object (in real-life, do not store plain text passwords)
    const newUser = { username, email, password };
  
    // Save the new user
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));
    alert("Sign up successful!");
    window.location.href = "/index.html";
  }
  
  /* ------------------- LOGOUT FUNCTION ------------------- */
  function handleLogout() {
    // Remove logged-in data
    localStorage.removeItem("loggedInUser");
    alert("Logged out!");
    window.location.href = "/index.html";
  }
  
  /* ------------------- UPDATE UI FUNCTION ------------------- */
  function updateUIForLoginState() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    // Assume your home page contains two containers:
    // One with the sign up and log in buttons (id="loggedOutButtons")
    // And another with the logout button (id="loggedInButtons")
    const loggedOutDiv = document.getElementById("loggedOutButtons");
    const loggedInDiv = document.getElementById("loggedInButtons");
  
    if (loggedInUser) {
      // When user is logged in, show the logout container
      if (loggedOutDiv) loggedOutDiv.style.display = "none";
      if (loggedInDiv) loggedInDiv.style.display = "block";
    } else {
      // When no user is logged in, show the sign up and log in container
      if (loggedOutDiv) loggedOutDiv.style.display = "block";
      if (loggedInDiv) loggedInDiv.style.display = "none";
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.getElementById("openSocialOverlay");
    const overlay = document.getElementById("socialOverlay");
    const closeBtn = document.getElementById("closeSocialOverlay");
  
    openBtn.addEventListener("click", function () {
      overlay.style.display = "block";
    });
  
    closeBtn.addEventListener("click", function () {
      overlay.style.display = "none";
    });
  
    // Optional: close overlay when clicking outside the inner content
    window.addEventListener("click", function (event) {
      if (event.target === overlay) {
        overlay.style.display = "none";
      }
    });
  });
  