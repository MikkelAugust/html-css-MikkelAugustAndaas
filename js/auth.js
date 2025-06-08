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
        const user = result.data;
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "/index.html";
    })
    .catch(error => {
      console.error("Login error:", error);
      alert("Login failed. Please check your email and password.");
    });
}
  
window.loginUser = loginUser;