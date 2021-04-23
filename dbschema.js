let realtimeDB = {
  games: {
    roomCode: "AXGV",
    active: true,
    filters: {
      origins: ["Original: Celebrity"],
      category: ["Celebrity"],
    },
    public: true,
    players: [],
    host: "",
  },
};

// createdAt(string);
// email;
// ("htdfcxbgr@email.com");
// handle;
// ("htdfcxbgr");
// imageUrl;
// ("https://firebasestorage.googleapis.com/v0/b/test-social-network-23ae2.appspot.com/o/12645543.jpg?alt=media");
// userId;
// ("LlRIykISzFhV2cO6Cz7y27SiCRe2");

let firestoreDB = {
  cards: {
    title: "Doge",
    origin: "Original: Celebrity",
    category: "Celebrity",
    description_sanatized:
      'An Internet meme that shows a Shiba lnu surrounded by colorful Comic Sans text that describes its inner monologue, such as "Wow," "Concern," and "so scare." There is much confuse over the name\'s pronunciation, yet it was recently used to brand a Bitcoin competitor.',
    points: 3,
    createdAt: "2021-01-21T03:14:26.291Z",
    lastModifiedAt: "2021-01-21T03:14:26.291Z",
  },
  users: {
    createdAt: "2021-04-19T17:46:51.522Z",
    username: "Kyle",
    uid: "vb7kRsdKO4bp5KCGh8rtRepcdC03",
  },
};
