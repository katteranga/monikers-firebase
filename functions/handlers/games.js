const { firestoreDB, realtimeDB } = require("../util/admin");

exports.createGame = (request, response) => {
  newGame = {
    roomCode: roomCodeGenerator(),
    active: true,
    filters: request.body.filters || {},
    private: request.body.private,
    // players: [request.player.username],
    // host: request.player.username,
    // players: [request.body.username],
    players: {},
    host: request.body.username,
  };

  // Create new game data
  let gameId;
  realtimeDB
    .ref("/games")
    .push(newGame)
    .then((snapshot) => {
      gameId = snapshot.key;

      // Add a backwards reference to the current game data for a room code
      realtimeDB
        .ref(`/roomCodes/${newGame.roomCode}`)
        .set(gameId)
        .then(() => {
          return response.status(200).json({ message: "Game created" });
        });
    })
    .then(() => {
      realtimeDB.ref(`/games/${gameId}/players`).push(request.body.username);
    })
    .catch((error) => {
      return response.status(500).json({ error: error.code });
    });
};

exports.getGameById = (request, response) => {
  realtimeDB.ref(`/games/${request.params.gameId}`).once(
    "value",
    (snapshot) => {
      return response.status(200).json(snapshot.val());
    },
    (error) => {
      return response.status(500).json({ error: error.code });
    }
  );
};

exports.getGameByRoomCode = (request, response) => {
  let gameId;

  realtimeDB
    .ref(`/roomCodes/${request.params.roomCode}`)
    .once(
      "value",
      (snapshot) => {
        gameId = snapshot.val();
      },
      (error) => {
        return response.status(500).json({ error: error.code });
      }
    )
    .then(() => {
      realtimeDB.ref(`/games/${gameId}`).once(
        "value",
        (snapshot) => {
          return response.status(200).json(snapshot.val());
        },
        (error) => {
          return response.status(500).json({ error: error.code });
        }
      );
    });
};

exports.joinGame = (request, response) => {
  realtimeDB
    .ref(`/games/${request.params.gameId}/players`)
    .push(request.body.username)
    .then((snapshot) => {
      return response.status(200).json(snapshot.val());
    })
    .catch((error) => {
      return response.status(500).json({ error: error.code });
    });
};

exports.startCardSelect = (request, response) => {
  let gameInfo;
  let cardIds;
  let cardSelectionData = {};
  let cardOptionsList;

  realtimeDB
    .ref("/cardIds")
    .once(
      "value",
      (snapshot) => {
        cardIds = Object.keys(snapshot.val());
      },
      (error) => {
        console.error(error);
        return response.status(500).json({ error: error.code });
      }
    )
    .then(() => {
      realtimeDB
        .ref(`/games/${request.params.gameId}`)
        .once(
          "value",
          (snapshot) => {
            gameInfo = snapshot.val();
          },
          (error) => {
            console.error(error);
            return response.status(500).json({ error: error.code });
          }
        )
        .then(() => {
          cardOptionsList = getRandomSubarray(
            cardIds,
            Object.keys(gameInfo).length * 8
          );

          console.log(cardOptionsList);

          //   console.log(gameInfo.players);
          let chunk = 0;
          for (const player of Object.values(gameInfo.players)) {
            cardSelectionData[player] = {
              cardOptions: cardOptionsList.slice(8 * chunk, 8 * (chunk + 1)),
            };
            chunk++;
          }

          //   console.log(cardOptionsList);

          realtimeDB
            .ref(`cardSelection/`)
            .child(request.params.gameId)
            .set(cardSelectionData);
        })
        .then(() => {
          return response.status(200).json({ message: "Card select created" });
        });
    })

    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

// app.get("/cardSelection/:gameId/:playerId", getPlayerCardPool);
exports.getPlayerCardPool = (request, response) => {
  realtimeDB
    .ref(`/cardSelection/${request.params.gameId}/${request.params.username}`)
    .once("value")
    .then((snapshot) => {
      return response.status(200).json(snapshot.val());
    })
    .catch((error) => {
      console.error(error);
      return response.status(400).json({ error: error.code });
    });
};

// app.post("/cardSelection/:gameId/:username", postPlayerCardPool);
exports.postPlayerCardPool = (request, response) => {
  console.log(
    `cardSelection/${request.params.gameId}/${request.params.username}`
  );
  console.log(request.body.cardChoices);

  realtimeDB
    .ref(
      `cardSelection/${request.params.gameId}/${request.params.username}/cardChoices`
    )
    .update(request.body.cardChoices)
    .then(() => {
      console.log("here");
      return response.status(201).json({ message: "Successfully updated" });
    })
    .catch((error) => {
      console.error(error);
      return response.status(400).json({ error: error.code });
    });
};

const roomCodeGenerator = () => {
  const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = [];
  for (i = 0; i < 4; i++)
    result.push(charPool.charAt(Math.floor(Math.random() * 26)));

  // TODO: If collisions become likely, add check here to
  return result.join("");
};

const getRandomSubarray = (array, selectNum) => {
  var result = new Array(selectNum),
    len = array.length,
    taken = new Array(len);
  if (selectNum > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (selectNum--) {
    var x = Math.floor(Math.random() * len);
    result[selectNum] = array[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};
