document.addEventListener("DOMContentLoaded", () => {
  // Create the overlay element dynamically
  const socialOverlay = document.createElement("div");
  socialOverlay.id = "socialOverlay";
  socialOverlay.innerHTML = `
    <div class="social-overlay-inner">
      <div class="social-overlay-header">
        <h2>Social Hub</h2>
        <div class="social-header-right">
          <input type="text" id="socialSearchInput" placeholder="Search profiles..." aria-label="Search Profiles">
          <button type="button" id="socialSearchBtn">Search</button>
          <span class="social-overlay-close" id="closeSocialOverlay" aria-label="Close Social Overlay">&times;</span>
        </div>
      </div>
      <div class="social-overlay-nav">
        <button type="button" class="social-tab active" data-tab="myProfile">My Profile</button>
        <button type="button" class="social-tab" data-tab="allProfiles">All Profiles</button>
        <button type="button" class="social-tab" data-tab="posts">Posts</button>
        <button type="button" class="social-tab" data-tab="activity">Activity</button>
      </div>
      <div class="social-overlay-body">
        <div class="social-content active" id="myProfile">
          <h3>My Profile</h3>
          <form id="profileForm">
            <label for="profileName">Name</label>
            <input type="text" id="profileName" required>
            <label for="profileBio">Bio (max 160 characters)</label>
            <textarea id="profileBio" maxlength="160"></textarea>
            <label for="profileAvatarUrl">Avatar URL</label>
            <input type="url" id="profileAvatarUrl">
            <label for="profileAvatarAlt">Avatar Alt (max 120 characters)</label>
            <input type="text" id="profileAvatarAlt" maxlength="120">
            <label for="profileBannerUrl">Banner URL</label>
            <input type="url" id="profileBannerUrl">
            <label for="profileBannerAlt">Banner Alt (max 120 characters)</label>
            <input type="text" id="profileBannerAlt" maxlength="120">
            <button type="submit">Save Profile</button>
          </form>
        </div>
        <div class="social-content" id="allProfiles">
          <h3>All Profiles</h3>
          <ul id="profileList">
            <li>Loading profiles...</li>
          </ul>
        </div>
        <div class="social-content" id="posts">
          <h3>Posts</h3>
          <ul id="postsList">
            <li>Loading posts...</li>
          </ul>
        </div>
        <div class="social-content" id="activity">
          <h3>Activity</h3>
          <ul id="activityList">
            <li>Loading activity...</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  // Append the overlay to the body
  document.body.appendChild(socialOverlay);

  // Hide overlay by default
  socialOverlay.style.display = "none";

  // Set up open/close functionality
  const openBtn = document.getElementById("openSocialOverlay");
  const closeBtn = document.getElementById("closeSocialOverlay");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      socialOverlay.style.display = "block";
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      socialOverlay.style.display = "none";
    });
  }
  // Optional: close overlay when clicking outside inner content
  socialOverlay.addEventListener("click", event => {
    if (event.target === socialOverlay) {
      socialOverlay.style.display = "none";
    }
  });

  // OPTIONAL: Add tab switching logic
  const tabs = socialOverlay.querySelectorAll(".social-tab");
  const contents = socialOverlay.querySelectorAll(".social-content");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active classes
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      // Activate clicked tab and its content
      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      const activeContent = socialOverlay.querySelector(`#${target}`);
      if (activeContent) activeContent.classList.add("active");
    });
  });

  // OPTIONAL: Handle the profile form submission (stub)
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", e => {
      e.preventDefault();
      // Here, you would collect the form data and send it to your registration endpoint.
      alert("Profile saved (stub)!");
      // For now, just close the overlay.
      socialOverlay.style.display = "none";
    });
  }
});