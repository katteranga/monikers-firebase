const { firestoreDB, realtimeDB } = require("../util/admin");

exports.getAllCards = (request, response) => {
  firestoreDB
    .collection("cards")
    .orderBy("createdAt", "desc")
    .get()
    .then((cardsData) => {
      console.log(cardsData);

      cards = [];
      cardsData.forEach((card) => {
        cards.push({
          cardId: card.id,
          ...card.data(),
        });
      });

      return response.json(cards);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: error.code });
    });
};

exports.getCardById = (request, response) => {
  let responseCard = {};
  firestoreDB
    .doc(`/cards/${request.params.cardId}`)
    .get()
    .then((document) => {
      if (!document.exists) {
        return response.status(404).json({ error: "Card not found" });
      } else {
        // card exists
        responseCard = document.data();
        responseCard.cardId = document.id;
        return response.status(200).json(responseCard);
      }
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: error.code });
    });
};

exports.postCard = (request, response) => {
  console.log("Got here");
  let newCard = {
    ...request.body,
    points: parseInt(request.body.points),
    lastModifiedAt: new Date().toISOString(),
  };

  console.log(newCard);

  firestoreDB
    .collection("cards")
    .add(newCard)
    .then((document) => {
      const responseCard = newCard;
      responseCard.cardId = document.id;

      realtimeDB.ref(`/cardIds/`).child(document.id).set(newCard.title);
      response.status(201).json({ responseCard });
    })
    .catch((error) => {
      response.status(500).json({ error: "Something went wrong" });
      console.error(error);
    });
};
