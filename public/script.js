const visitsEl = document.getElementById("visits");
const likesEl = document.getElementById("likes");
const updatedAtEl = document.getElementById("updatedAt");
const messageInput = document.getElementById("messageInput");

async function loadState() {
  const response = await fetch("/api/state");

  const state = await response.json();

  render(state);
}

function render(state) {
  visitsEl.textContent = state.visits;
  likesEl.textContent = state.likes;

  messageInput.value = state.message;

  updatedAtEl.textContent =
    new Date(state.updatedAt).toLocaleString("it-IT");
}

async function send(url, body = {}) {

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const state = await response.json();

  render(state);
}

document
  .getElementById("likeBtn")
  .addEventListener("click", () => {
    send("/api/like");
  });

document
  .getElementById("saveMessageBtn")
  .addEventListener("click", () => {

    send("/api/message", {
      message: messageInput.value
    });

  });

document
  .getElementById("resetBtn")
  .addEventListener("click", () => {
    send("/api/reset");
  });

document
  .querySelectorAll("[data-mood]")
  .forEach(button => {

    button.addEventListener("click", () => {

      send("/api/mood", {
        mood: button.dataset.mood
      });

    });

  });

loadState();
