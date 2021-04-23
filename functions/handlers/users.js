const { firestoreDB } = require("../util/admin");

// const firebase = require("firebase");
// const config = require("../util/config");
// firebase.initializeApp(config);

// app.post("/user/", updateUsername);
exports.updateUsername = (request, response) => {
  firestoreDB
    .doc(`/users/${request.user.uid}`)
    .update({ username: request.body.username })
    .then(() => {
      return response.status(200).json({ message: "username updated" });
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};
