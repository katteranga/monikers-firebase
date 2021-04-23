const admin = require("firebase-admin");

admin.initializeApp();

const firestoreDB = admin.firestore();
const realtimeDB = admin.database();

module.exports = { admin, firestoreDB, realtimeDB };
