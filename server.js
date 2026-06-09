const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "state.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function initializeData() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialState = {
      visits: 0,
      likes: 0,
      message: "Benvenuti alla lezione sul deploy!",
      mood: "curious",
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(initialState, null, 2)
    );
  }
}

function readState() {
  initializeData();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeState(state) {
  state.updatedAt = new Date().toISOString();

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(state, null, 2)
  );
}

app.get("/api/state", (req, res) => {
  const state = readState();

  state.visits++;

  writeState(state);

  res.json(state);
});

app.post("/api/like", (req, res) => {
  const state = readState();

  state.likes++;

  writeState(state);

  res.json(state);
});

app.post("/api/message", (req, res) => {
  const state = readState();

  state.message = req.body.message || "";

  writeState(state);

  res.json(state);
});

app.post("/api/mood", (req, res) => {
  const state = readState();

  state.mood = req.body.mood || "curious";

  writeState(state);

  res.json(state);
});

app.post("/api/reset", (req, res) => {
  const state = {
    visits: 0,
    likes: 0,
    message: "Stato resettato dal server",
    mood: "curious",
    updatedAt: new Date().toISOString()
  };

  writeState(state);

  res.json(state);
});

app.listen(PORT, () => {
  console.log(`Server attivo sulla porta ${PORT}`);
});
