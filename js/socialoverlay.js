document.addEventListener("DOMContentLoaded", () => {

  const socialOverlay = document.createElement("div");
  socialOverlay.id = "socialOverlay";
  socialOverlay.innerHTML = `
    <div class="social-overlay-inner">
      <div class="social-overlay-header">
        <h2>Social Hub</h2>
        <div class="social-header-right">
          <input type="text" id="socialSearchInput" placeholder="Search profiles, posts, or trade posts..." aria-label="Search">
          <button type="button" id="socialSearchBtn">Search</button>
          <span class="social-overlay-close" id="closeSocialOverlay" aria-label="Close Social Overlay">&times;</span>
        </div>
      </div>
      <div class="social-overlay-nav">
        <button type="button" class="social-tab active" data-tab="myProfile">My Profile</button>
        <button type="button" class="social-tab" data-tab="allProfiles">All Profiles</button>
        <button type="button" class="social-tab" data-tab="posts">Posts</button>
        <button type="button" class="social-tab" data-tab="activity">Activity</button>
        <button type="button" class="social-tab" data-tab="searchResults" style="display:none;">Search Results</button>
      </div>
      <div class="social-overlay-body">
        <!-- My Profile Tab -->
        <div class="social-content active" id="myProfile">
          <h3>My Profile</h3>
          <form id="profileForm">
            <label for="profileName">Name</label>
            <input type="text" id="profileName" required>
            <label for="profileBio">Bio (max 160 characters)</label>
            <textarea id="profileBio" maxlength="160"></textarea>
            <fieldset id="categoryFieldset">
              <legend>Favorite Game Categories</legend>
              <label class="category-label"><input type="checkbox" name="categories" value="sports"> Sports</label>
              <label class="category-label"><input type="checkbox" name="categories" value="action"> Action</label>
              <label class="category-label"><input type="checkbox" name="categories" value="adventure"> Adventure</label>
              <label class="category-label"><input type="checkbox" name="categories" value="horror"> Horror</label>
            </fieldset>
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
          <!-- Profile Preview Section -->
          <div id="profilePreview">
            <h4>Profile Preview</h4>
            <img id="profileAvatarPreview" src="" alt="Avatar Preview">
            <img id="profileBannerPreview" src="" alt="Banner Preview">
            <p id="profileNameDisplay"></p>
            <p id="profileBioDisplay"></p>
            <p id="profileCategoriesDisplay"></p>
          </div>
        </div>
        <!-- All Profiles Tab -->
        <div class="social-content" id="allProfiles" style="display:none;">
          <h3>All Profiles</h3>
          <div id="allProfilesContainer">
            <p>Loading profiles...</p>
          </div>
        </div>
        <!-- Posts Tab -->
        <div class="social-content" id="posts" style="display:none;">
          <h3>Posts</h3>
          <div id="postCreation">
            <textarea id="postContent" placeholder="What's on your mind?" rows="3"></textarea>
            <input type="file" id="postMedia" accept="image/*,video/*">
            <button type="button" id="createPostBtn">Post</button>
          </div>
          <ul id="postsList"></ul>
        </div>
        <!-- Activity Tab -->
        <div class="social-content" id="activity" style="display:none;">
          <h3>Activity</h3>
          <form id="activityForm">
            <label for="activityType">I want to:</label>
            <select id="activityType" name="activityType">
              <option value="post">Upload Gameplay Post</option>
              <option value="trade">Trade a Game</option>
            </select>
            <div id="activityPostFields">
              <label for="activityPostContent">Post Content</label>
              <textarea id="activityPostContent" placeholder="Share your gameplay..." rows="3"></textarea>
              <input type="file" id="activityPostMedia" accept="image/*,video/*">
            </div>
            <div id="activityTradeFields" style="display: none;">
              <label for="tradeGameTitle">Game Title</label>
              <input type="text" id="tradeGameTitle" placeholder="Game Title">
              <label for="tradeDescription">Description</label>
              <textarea id="tradeDescription" placeholder="Describe the trade..." rows="3"></textarea>
              <input type="file" id="tradeImage" accept="image/*">
            </div>
            <button type="submit">Submit Activity</button>
          </form>
          <div id="activityList">
            <h4>Recent Activity</h4>
            <ul id="activityItems">
              <li>No activity yet.</li>
            </ul>
          </div>
        </div>
        <!-- Search Results Tab -->
        <div class="social-content" id="searchResults" style="display:none;"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(socialOverlay);
  socialOverlay.style.display = "none";

  const openBtn = document.getElementById("openSocialOverlay");
  const closeBtn = document.getElementById("closeSocialOverlay");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (!localStorage.getItem("loggedInUser")) {
        window.showToast ? showToast("Please log in to access the Social Hub.") : alert("Please log in to access the Social Hub.");
        return;
      }
      socialOverlay.style.display = "block";
      loadSavedProfile();
      renderPosts();
      renderAllProfiles();
      renderActivity();
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      socialOverlay.style.display = "none";
    });
  }
  socialOverlay.addEventListener("click", event => {
    if (event.target === socialOverlay) {
      socialOverlay.style.display = "none";
    }
  });
  
  const tabs = socialOverlay.querySelectorAll(".social-tab");
  const contents = socialOverlay.querySelectorAll(".social-content");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => {
        c.classList.remove("active");
        c.style.display = "none";
      });
      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      const activeContent = socialOverlay.querySelector(`#${target}`);
      if (activeContent) {
        activeContent.classList.add("active");
        activeContent.style.display = "block";
      }
    });
  });
  
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const profileKey = loggedInUser ? "socialProfile_" + loggedInUser.email : "socialProfile";

  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("profileName").value.trim();
      const bio = document.getElementById("profileBio").value.trim();
      const avatarUrl = document.getElementById("profileAvatarUrl").value.trim();
      const avatarAlt = document.getElementById("profileAvatarAlt").value.trim();
      const bannerUrl = document.getElementById("profileBannerUrl").value.trim();
      const bannerAlt = document.getElementById("profileBannerAlt").value.trim();
      const categoryCheckboxes = document.querySelectorAll('input[name="categories"]:checked');
      const categories = Array.from(categoryCheckboxes).map(cb => cb.value);
      if (!name) {
        alert("Please enter your name.");
        return;
      }
      const profileData = {
        name,
        bio,
        categories,
        avatar: { url: avatarUrl, alt: avatarAlt },
        banner: { url: bannerUrl, alt: bannerAlt },
        email: loggedInUser ? loggedInUser.email : ""
      };
      localStorage.setItem(profileKey, JSON.stringify(profileData));
      let profiles = JSON.parse(localStorage.getItem("socialProfiles")) || [];
      profiles = profiles.filter(p => p.email !== profileData.email);
      profiles.unshift(profileData);
      localStorage.setItem("socialProfiles", JSON.stringify(profiles));
      alert("Profile saved!");
      updateProfilePreview(profileData);
      renderAllProfiles();
    });
  }
  
  function loadSavedProfile() {
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      document.getElementById("profileName").value = profileData.name || "";
      document.getElementById("profileBio").value = profileData.bio || "";
      document.getElementById("profileAvatarUrl").value = (profileData.avatar && profileData.avatar.url) || "";
      document.getElementById("profileAvatarAlt").value = (profileData.avatar && profileData.avatar.alt) || "";
      document.getElementById("profileBannerUrl").value = (profileData.banner && profileData.banner.url) || "";
      document.getElementById("profileBannerAlt").value = (profileData.banner && profileData.banner.alt) || "";
      if (profileData.categories && Array.isArray(profileData.categories)) {
        document.querySelectorAll('input[name="categories"]').forEach(cb => {
          cb.checked = profileData.categories.includes(cb.value);
        });
      }
      updateProfilePreview(profileData);
    }
  }
  
  function updateProfilePreview(profileData) {
    const avatarPreview = document.getElementById("profileAvatarPreview");
    const bannerPreview = document.getElementById("profileBannerPreview");
    const nameDisplay = document.getElementById("profileNameDisplay");
    const bioDisplay = document.getElementById("profileBioDisplay");
    const categoriesDisplay = document.getElementById("profileCategoriesDisplay");
    if (avatarPreview) {
      avatarPreview.src = (profileData.avatar && profileData.avatar.url) || "";
      avatarPreview.alt = (profileData.avatar && profileData.avatar.alt) || "Avatar Preview";
    }
    if (bannerPreview) {
      bannerPreview.src = (profileData.banner && profileData.banner.url) || "";
      bannerPreview.alt = (profileData.banner && profileData.banner.alt) || "Banner Preview";
    }
    if (nameDisplay) {
      nameDisplay.textContent = profileData.name || "";
    }
    if (bioDisplay) {
      bioDisplay.textContent = profileData.bio || "";
    }
    if (categoriesDisplay) {
      categoriesDisplay.textContent = profileData.categories && profileData.categories.length > 0
        ? "Favorite Categories: " + profileData.categories.join(", ")
        : "";
    }
  }

  function loadPosts() {
    return JSON.parse(localStorage.getItem("socialPosts")) || [];
  }
  function savePosts(posts) {
    localStorage.setItem("socialPosts", JSON.stringify(posts));
  }
  function renderPosts() {
    const postsList = document.getElementById("postsList");
    if (!postsList) return;
    const posts = loadPosts();
    postsList.innerHTML = "";
    if (posts.length === 0) {
      postsList.innerHTML = "<li>No posts yet.</li>";
    } else {
      posts.forEach((post, index) => {
        let commentsHtml = "";
        if (post.comments && post.comments.length > 0) {
          commentsHtml = `<div class="comments-section" id="comments-${index}">` +
            post.comments.map(c => `<p><strong>${c.author}</strong>: ${c.text}</p>`).join("") +
            `</div>`;
        } else {
          commentsHtml = `<div class="comments-section" id="comments-${index}"></div>`;
        }
        const li = document.createElement("li");
        li.classList.add("post-item");
        li.innerHTML = `
          <div class="post-header" style="position: relative;">
            <img class="post-avatar" src="${post.avatarUrl}" alt="${post.avatarAlt}" />
            <span class="post-author"><a href="/profile.html?email=${post.email || ''}">${post.author}</a></span>
            <span class="post-date">${new Date(post.timestamp).toLocaleString()}</span>
            <button class="post-menu" data-index="${index}">⋮</button>
            <div class="post-menu-options" data-index="${index}" style="display: none;">
              <button class="edit-post" data-index="${index}">Edit</button>
              <button class="delete-post" data-index="${index}">Delete</button>
            </div>
          </div>
          <div class="post-body">
            <p>${post.content}</p>
            ${
              post.media
                ? `<div class="post-media">${
                    post.media.type.startsWith("image")
                      ? `<img src="${post.media.url}" alt="${post.media.alt}" class="post-image" />`
                      : `<video controls src="${post.media.url}" alt="${post.media.alt}" class="post-video"></video>`
                  }</div>`
                : ""
            }
          </div>
          <button class="comment-btn" data-index="${index}">Comment</button>
          ${commentsHtml}
        `;
        postsList.appendChild(li);
      });
    }
  
    document.querySelectorAll(".post-menu").forEach(menuBtn => {
      menuBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const idx = this.getAttribute("data-index");
        const options = document.querySelector(`.post-menu-options[data-index="${idx}"]`);
        if (options) {
          options.style.display = (options.style.display === "none" || options.style.display === "") ? "block" : "none";
        }
      });
    });
  
    document.querySelectorAll(".delete-post").forEach(delBtn => {
      delBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const idx = this.getAttribute("data-index");
        let posts = loadPosts();
        posts.splice(idx, 1);
        savePosts(posts);
        renderPosts();
      });
    });
  
    document.querySelectorAll(".edit-post").forEach(editBtn => {
      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const idx = this.getAttribute("data-index");
        let posts = loadPosts();
        const currentContent = posts[idx].content;
        const newContent = prompt("Edit your post:", currentContent);
        if (newContent !== null) {
          posts[idx].content = newContent;
          savePosts(posts);
          renderPosts();
        }
      });
    });
  
    document.querySelectorAll(".comment-btn").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const idx = this.getAttribute("data-index");
        const commentText = prompt("Enter your comment:");
        if (commentText) {
          let posts = loadPosts();
          if (!posts[idx].comments) posts[idx].comments = [];
          const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
          const authorName = (loggedUser && loggedUser.username) || "Anonymous";
          posts[idx].comments.push({ author: authorName, text: commentText });
          savePosts(posts);
          renderPosts();
        }
      });
    });
  
    document.addEventListener("click", () => {
      document.querySelectorAll(".post-menu-options").forEach(options => {
        options.style.display = "none";
      });
    });
  }
  
  const createPostBtn = document.getElementById("createPostBtn");
  if (createPostBtn) {
    createPostBtn.addEventListener("click", () => {
      const postContent = document.getElementById("postContent").value.trim();
      const postMediaInput = document.getElementById("postMedia");
      let media = null;
      if (postMediaInput && postMediaInput.files.length > 0) {
        const file = postMediaInput.files[0];
        media = {
          url: URL.createObjectURL(file),
          alt: file.name,
          type: file.type
        };
      }
      if (!postContent && !media) {
        alert("Please enter some content or attach a media file for your post.");
        return;
      }
      const userProfile = JSON.parse(localStorage.getItem("socialProfile_" + (loggedInUser ? loggedInUser.email : "")));
      let author = "Anonymous";
      let avatarUrl = "/images/default.jpg";
      let avatarAlt = "Default Avatar";
      if (userProfile) {
        author = userProfile.name || "Anonymous";
        if (userProfile.avatar) {
          avatarUrl = userProfile.avatar.url || avatarUrl;
          avatarAlt = userProfile.avatar.alt || avatarAlt;
        }
      }
      const newPost = {
        content: postContent,
        author: author,
        avatarUrl: avatarUrl,
        avatarAlt: avatarAlt,
        media: media,
        timestamp: Date.now(),
        email: loggedInUser ? loggedInUser.email : ""
      };
      const posts = loadPosts();
      posts.unshift(newPost);
      savePosts(posts);
      renderPosts();
      document.getElementById("postContent").value = "";
      if (postMediaInput) postMediaInput.value = "";
    });
  }
  renderPosts();

  const activityTypeSelect = document.getElementById("activityType");
  const activityPostFields = document.getElementById("activityPostFields");
  const activityTradeFields = document.getElementById("activityTradeFields");
  if (activityTypeSelect) {
    activityTypeSelect.addEventListener("change", () => {
      if (activityTypeSelect.value === "trade") {
        activityPostFields.style.display = "none";
        activityTradeFields.style.display = "block";
      } else {
        activityPostFields.style.display = "block";
        activityTradeFields.style.display = "none";
      }
    });
  }
  const activityForm = document.getElementById("activityForm");
  if (activityForm) {
    activityForm.addEventListener("submit", e => {
      e.preventDefault();
      const type = activityTypeSelect.value;
      let activityData = {};
      if (type === "post") {
        const content = document.getElementById("activityPostContent").value.trim();
        let media = null;
        const activityMediaInput = document.getElementById("activityPostMedia");
        if (activityMediaInput && activityMediaInput.files.length > 0) {
          const file = activityMediaInput.files[0];
          media = {
            url: URL.createObjectURL(file),
            alt: file.name,
            type: file.type
          };
        }
        if (!content && !media) {
          alert("Please enter content or attach a media file for your post.");
          return;
        }
        activityData = {
          type: "post",
          content,
          media,
          timestamp: Date.now()
        };
      } else if (type === "trade") {
        const gameTitle = document.getElementById("tradeGameTitle").value.trim();
        const description = document.getElementById("tradeDescription").value.trim();
        let tradeImage = null;
        const tradeImageInput = document.getElementById("tradeImage");
        if (tradeImageInput && tradeImageInput.files.length > 0) {
          const file = tradeImageInput.files[0];
          tradeImage = {
            url: URL.createObjectURL(file),
            alt: file.name,
            type: file.type
          };
        }
        if (!gameTitle || !description) {
          alert("Please enter both game title and trade description.");
          return;
        }
        activityData = {
          type: "trade",
          gameTitle,
          description,
          tradeImage,
          timestamp: Date.now()
        };
      }
      let activities = JSON.parse(localStorage.getItem("socialActivity")) || [];
      activities.unshift(activityData);
      localStorage.setItem("socialActivity", JSON.stringify(activities));
      alert("Activity submitted!");
      activityForm.reset();
      activityPostFields.style.display = "block";
      activityTradeFields.style.display = "none";
      renderActivity();
    });
  }
  function renderActivity() {
    const activityItemsList = document.getElementById("activityItems");
    if (!activityItemsList) return;
    const activities = JSON.parse(localStorage.getItem("socialActivity")) || [];
    activityItemsList.innerHTML = "";
    if (activities.length === 0) {
      activityItemsList.innerHTML = "<li>No activity yet.</li>";
    } else {
      activities.forEach(activity => {
        const li = document.createElement("li");
        li.classList.add("activity-item");
        if (activity.type === "post") {
          li.innerHTML = `
            <div class="activity-post">
              <p><strong>Post:</strong> ${activity.content}</p>
              ${
                activity.media
                  ? `<div class="activity-media">${
                      activity.media.type.startsWith("image")
                        ? `<img src="${activity.media.url}" alt="${activity.media.alt}" class="post-image" />`
                        : `<video controls src="${activity.media.url}" alt="${activity.media.alt}" class="post-video"></video>`
                    }</div>`
                  : ""
              }
              <span class="activity-date">${new Date(activity.timestamp).toLocaleString()}</span>
            </div>
          `;
        } else if (activity.type === "trade") {
          li.innerHTML = `
            <div class="activity-trade">
              <p><strong>Trade:</strong> ${activity.gameTitle}</p>
              <p>${activity.description}</p>
              ${
                activity.tradeImage
                  ? `<div class="trade-image"><img src="${activity.tradeImage.url}" alt="${activity.tradeImage.alt}" /></div>`
                  : ""
              }
              <span class="activity-date">${new Date(activity.timestamp).toLocaleString()}</span>
            </div>
          `;
        }
        activityItemsList.appendChild(li);
      });
    }
  }
  renderActivity();
  
  const searchBtn = document.getElementById("socialSearchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = document.getElementById("socialSearchInput").value.trim().toLowerCase();
      if (!query) return;
      
      let profiles = JSON.parse(localStorage.getItem("socialProfiles")) || [];
      let posts = JSON.parse(localStorage.getItem("socialPosts")) || [];
      let activities = JSON.parse(localStorage.getItem("socialActivity")) || [];
      
      const filteredProfiles = profiles.filter(p => 
        p.name.toLowerCase().includes(query) || (p.bio && p.bio.toLowerCase().includes(query))
      );
      const filteredPosts = posts.filter(post => 
        post.content.toLowerCase().includes(query) || post.author.toLowerCase().includes(query)
      );
      const filteredTrades = activities.filter(act => 
        act.type === "trade" && (act.gameTitle.toLowerCase().includes(query) || act.description.toLowerCase().includes(query))
      );
      
      let html = "<h3>Search Results</h3>";
      html += "<h4>Profiles</h4>";
      if (filteredProfiles.length === 0) {
        html += "<p>No matching profiles.</p>";
      } else {
        filteredProfiles.forEach(profile => {
          html += `<div class="profile-box">
                    <a href="/profile.html?email=${profile.email}">
                      <img class="avatar" src="${(profile.avatar && profile.avatar.url) || '/images/default.jpg'}" alt="${(profile.avatar && profile.avatar.alt) || 'Avatar'}">
                      <h4>${profile.name}</h4>
                    </a>
                    <p class="bio">${profile.bio || "No bio available."}</p>
                  </div>`;
        });
      }
      html += "<h4>Posts</h4>";
      if (filteredPosts.length === 0) {
        html += "<p>No matching posts.</p>";
      } else {
        filteredPosts.forEach(post => {
          html += `<div class="post-item">
                    <div class="post-header">
                      <span class="post-author"><a href="/profile.html?email=${post.email || ''}">${post.author}</a></span>
                      <span class="post-date">${new Date(post.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="post-body">
                      <p>${post.content}</p>
                    </div>
                  </div>`;
        });
      }
      html += "<h4>Trade Posts</h4>";
      if (filteredTrades.length === 0) {
        html += "<p>No matching trade posts.</p>";
      } else {
        filteredTrades.forEach(trade => {
          html += `<div class="trade-item">
                    <div class="trade-header">
                      <span class="trade-game">${trade.gameTitle}</span>
                    </div>
                    <div class="trade-body">
                      <p>${trade.description}</p>
                    </div>
                  </div>`;
        });
      }
      
      const searchResultsDiv = document.getElementById("searchResults");
      searchResultsDiv.innerHTML = html;
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => {
        c.classList.remove("active");
        c.style.display = "none";
      });
      document.querySelector('[data-tab="searchResults"]').style.display = "inline-block";
      document.querySelector('[data-tab="searchResults"]').classList.add("active");
      searchResultsDiv.classList.add("active");
      searchResultsDiv.style.display = "block";
    });
  }
  

  function renderAllProfiles() {
    const container = document.getElementById("allProfilesContainer");
    if (!container) return;
    let profiles = JSON.parse(localStorage.getItem("socialProfiles")) || [];
    container.innerHTML = "";
    if (profiles.length === 0) {
      container.innerHTML = "<p>No profiles available.</p>";
    } else {
      profiles.forEach(profile => {
        const box = document.createElement("div");
        box.classList.add("profile-box");
        box.innerHTML = `
          <a href="/profile.html?email=${profile.email}">
            <img class="avatar" src="${(profile.avatar && profile.avatar.url) || '/images/default.jpg'}" alt="${(profile.avatar && profile.avatar.alt) || 'Avatar'}">
            <h4>${profile.name}</h4>
          </a>
          <p class="bio">${profile.bio || "No bio available."}</p>
          <p class="categories">${profile.categories && profile.categories.length > 0 ? "Categories: " + profile.categories.join(", ") : ""}</p>
        `;
        container.appendChild(box);
      });
    }
  }
  renderAllProfiles();
});