// /js/auth.js

/**
 * Login a user using the Noroff API.
 * @param {string} email - The user's email (should end with @stud.noroff.no).
 * @param {string} password - The user's password.
 */
function loginUser(email, password) {
    fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Login failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then(result => {
        console.log("Login result:", result);
        // The API returns the user profile in result.data
        const user = result.data;
        // Save user data in localStorage for later use
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        // Optionally, update your UI or redirect the user:
        alert("Login successful!");
        window.location.href = "/index.html";
      })
      .catch(error => {
        console.error("Login error:", error);
        alert("Login failed. Please check your email and password.");
      });
  }
  
  // Make the login function globally available
  window.loginUser = loginUser;  