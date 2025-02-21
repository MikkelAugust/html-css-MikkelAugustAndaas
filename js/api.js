// /js/api.js
export function fetchGameData() {
    return fetch("https://v2.api.noroff.dev/gamehub")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok: " + response.statusText);
        }
        return response.json();
      })
      .then(result => result.data || result);
  }  