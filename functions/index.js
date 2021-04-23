const functions = require("firebase-functions");
const app = require("express")();

// TODO (?) Add permanant users with signup/login/authentication
const anonymousAuth = require("./util/anonymousAuth");
// const { db } = require("./util/admin");

// Card routes
const { getAllCards, getCardById, postCard } = require("./handlers/cards");

app.get("/cards", getAllCards);
app.get("/card/:cardId", getCardById);
app.post("/card", postCard); // Depricate this once batch loading is done

// Game routes
const {
  createGame,
  getGameById,
  getGameByRoomCode,
  joinGame,
  startCardSelect,
  getPlayerCardPool,
  postPlayerCardPool,
} = require("./handlers/games");

app.post("/games/new", createGame);
app.get("/games/:gameId", getGameById);
app.get("/games/roomCode/:roomCode", getGameByRoomCode);
app.post("/games/:gameId/join", joinGame);
app.get("/cardSelection/:gameId/start", startCardSelect);
app.get("/cardSelection/:gameId/:username", getPlayerCardPool);
app.post("/cardSelection/:gameId/:username", postPlayerCardPool);

// Player routes
const { updateUsername } = require("./handlers/users");

app.post("/user/", updateUsername);

exports.api = functions.https.onRequest(app);
