const express = require("express");
const mongoose = require("mongoose");
const {
  RoomModel,
  PlayerModel,
  CardModel,
  TeamModel,
  ClueModel,
} = require("./schema");
const http = require("http");
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const { connectToDb, getDb } = require("./db");
const app = express();

const HTTPserver = http.createServer(app);

const io = socketIo(HTTPserver, {
  cors: {
    origin: ["https://codenames-frontend-hf8p.onrender.com","http://localhost:5173"],
  },
});

const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
const JWT_SECRET = "secret";
/*io.use((socket, next) => {
  const authHeader = socket.handshake.auth.token;
  if (!authHeader) {
    return next(new Error("Missing auth header"));
  }
  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET);
    if (decoded && decoded.id) {
      socket.user = decoded;
      return next();
    } else {
      return next(new Error("Incorrect token"));
    }
  } catch (error) {
    return next(error);
  }
});*/
io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  socket.on("join-game", async (name, gameid) => {
    console.log(name, "joined", gameid);
    socket.data = { name: name, game: gameid };
    socket.join(gameid);
    const newPlayer = new PlayerModel({ name: name });

    try {
      const updatedDocument = await RoomModel.findOneAndUpdate(
        { _id: gameid, "players.name": { $ne: newPlayer.name } },
        { $push: { players: newPlayer } },
        { new: true }
      );

      if (!updatedDocument) {
        //console.error("Document not found");
        // Handle the case where the document is not found
        return;
      }

      //console.log("Document updated successfully:", updatedDocument);
    } catch (err) {
      console.error("Error updating document:", err);
      // Handle the error appropriately
    }
    socket.to(gameid).emit("joined-game",newPlayer);
  });
  socket.on("join-team", async (name, color, role, gameid) => {
    console.log(name, "joined", color, "team as a(n)", role);
    const newPlayer = new PlayerModel({
      name: name,
      role: role,
      team: color,
    });

    try {
      let updatedDocument;
      const game = await RoomModel.findById(gameid);
      if (
        color === "blue" &&
        !game.blueTeam.players.find((p) => p.name === newPlayer.name)
      ) {
        updatedDocument = await RoomModel.findOneAndUpdate(
          { _id: gameid },
          { $push: { "blueTeam.players": newPlayer } },
          { new: true }
        );
      } else if (
        color === "red" &&
        !game.redTeam.players.find((p) => p.name === newPlayer.name)
      ) {
        updatedDocument = await RoomModel.findOneAndUpdate(
          { _id: gameid },
          { $push: { "redTeam.players": newPlayer } },
          { new: true }
        );
      }

      if (!updatedDocument) {
        //console.error("Document not found");
        // Handle the case where the document is not found
      }

      //console.log("Document updated successfully:", updatedDocument);
    } catch (err) {
      console.error("Error updating document:", err);
      // Handle the error appropriately
    }

    socket.to(gameid).emit("team-join", name, color, role);
  });
  socket.on("clue", (player, clue, log, gameid) => {
    const newClue = new ClueModel({
      text: clue.text,
      number: Number(clue.number),
    });
    console.log(player.name, "gives clue ", clue);
    RoomModel.findOneAndUpdate(
      { _id: gameid },
      {
        $push: { game_log: log },
        $set: { currentClue: newClue },
      },
      { new: true }
    )
      .then((updatedDocument) => {
        if (!updatedDocument) {
          console.error("Document not found");
          // Handle the case where the document is not found
          return;
        }

        // console.log("Document updated successfully:", updatedDocument);
        socket.to(gameid).emit("get-clue", player, clue);
      })
      .catch((err) => {
        console.error("Error updating document:", err);
        // Handle the error appropriately
      });
  });
  socket.on(
    "guess",
    async (
      player,
      color,
      key,
      blueCardsLeft,
      redCardsLeft,
      tries,
      maxtries,
      gameid
    ) => {
      const correct = color === player.team;
      const blue_red = color === "blue" || color === "red";

      console.log(
        player.name,
        "guessed",
        correct ? "correctly" : "incorrectly"
      );
      const card = new CardModel({
        img: key,
        team: color,
      });
      let newBlueCardsLeft = blueCardsLeft;
      let newRedCardsLeft = redCardsLeft;
      const grayCard = color === "gray";
      const lastTrie = maxtries - (tries + 1) === -1;
      let newCurrentTeam = player.team;
      if (correct) {
        if (color === "blue") {
          newBlueCardsLeft = Number(blueCardsLeft) - 1;
          if (lastTrie) {
            newCurrentTeam = "red";
          }
        } else if (color === "red") {
          newRedCardsLeft = Number(redCardsLeft) - 1;
          if (lastTrie) {
            newCurrentTeam = "blue";
          }
        }
      } else {
        if (color === "blue") {
          newBlueCardsLeft = Number(blueCardsLeft) - 1;
          newCurrentTeam = "blue";
        } else if (color === "red") {
          newRedCardsLeft = Number(redCardsLeft) - 1;
          newCurrentTeam = "red";
        }else{
          if (player.team === "blue") {
            newCurrentTeam = "red";
          }
          else{
            newCurrentTeam = "blue";
          }
        }
      }
      const newTries = !lastTrie && correct ? tries + 1 : 0;
      const game = await RoomModel.findById(gameid);
      game.revealedCards.push(card.img);
      game.blueTeam.cardsLeft = newBlueCardsLeft;
      game.redTeam.cardsLeft = newRedCardsLeft;
      game.tries = newTries;
      game.currentTeam = newCurrentTeam;
      if(!correct || lastTrie) game.currentClue = null;
      await game.save();
      console.log("correct: ",correct, "blue_red: ",blue_red,key,newBlueCardsLeft,newRedCardsLeft,grayCard,"newTries: ",newTries, "newCurrentTeam: ",newCurrentTeam, "lastTrie: ",lastTrie);
      socket.to(gameid).emit("get-guess",player,correct,blue_red,key,newBlueCardsLeft,newRedCardsLeft,grayCard,newTries);
    }
  );
  socket.on("end-guessing", async (gameid) => {
    const game = await RoomModel.findById(gameid);
    game.currentTeam === "red"?game.currentTeam = "blue":game.currentTeam = "red";
    game.currentClue = null;
    game.tries = 0;
    await game.save();
    socket.to(gameid).emit("end-guess");
  });
  socket.on("hint", (player, key, gameid) => {
    socket.to(gameid).emit("get-hint", key);
  });
  socket.on("name-change", async (oldName,newName,gameid)=>{
    socket.to(gameid).emit("name-changed",oldName,newName);
    const game = await RoomModel.findById(gameid);
    const playerInPlayers = game.players.find(p=>p.name===oldName);
    const playerInTeam = game.redTeam.players.find(p=>p.name===oldName) || game.blueTeam.players.find(p=>p.name===oldName);
    if (game.admin === oldName) {
      game.admin = newName;
    }
    playerInPlayers.name = newName;
    if (playerInTeam) {
      playerInTeam.name = newName;
    }
    await game.save();
    console.log(oldName, " changed their name to ", newName);
  })
  socket.on("leave-team", async (name,team,gameid)=>{
    const game = await RoomModel.findById(gameid);
    if (team === "blue") {
      game.blueTeam.players = game.blueTeam.players.filter(p=>p.name != name);
    }
    else{
      game.redTeam.players = game.redTeam.players.filter(p=>p.name != name);
    }
    await game.save();
    console.log(name + " left the "+ team+" team");
    socket.to(gameid).emit("left-team",name,team);
  })
  socket.on("newGame", (newGameId, gameid) => {
    socket.to(gameid).emit("new-game", newGameId);
  });
  socket.on("disconnect", async (reason) => {
    const name = socket.data.name;
    const gameid = socket.data.game;
    console.log(name + " disconnected from: " + gameid,reason);
    io.to(gameid).emit("userLeft", name);
  });
  socket.on("connect_error", (err) => {
    console.log(err.message);
  });
});

let db;
connectToDb((err) => {
  if (!err) {
    HTTPserver.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    db = getDb();
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/joinRoom", (req, res) => {
  const name = req.body.name;
  res.status(210).json({ msg: "OK" });
});
app.post("/createRoom", (req, res) => {
  const name = req.body.name;
  let cards = [];
  if (req.body.cards != undefined) {
    cards = req.body.cards;
  }
  let deck = newDeck(cards);
  const blues = deck.reduce(((prev,current)=>current.team==="blue"?prev+1:prev),0); 
  const startTeam = blues === 9? "blue" : "red";
  const newRoom = new RoomModel({
    startTeam: startTeam,
    game_log: [],
    cards: deck,
    revealedCards: [],
    players: [],
    blueTeam: new TeamModel({
      players: [],
      cardsLeft: startTeam === "blue" ? 9 : 8,
    }),
    redTeam: new TeamModel({
      players: [],
      cardsLeft: startTeam === "red" ? 9 : 8,
    }),
    tries: 0,
    activeClue: false,
    admin: name,
    currentClue: undefined,
    currentTeam: startTeam,
  });
  let newRoomID;
  newRoom
    .save()
    .then((result) => {
      console.log("Room saved to the database:", result.id);
      newRoomID = result.id;
    })
    .catch((error) => {
      console.error("Error saving user to the database:", error);
    })
    .finally(() => {
      // Close the connection after saving
      res.status(210).json({ roomid: newRoomID });
    });
});
app.get("/:id", async (req, res) => {
  const game = await RoomModel.findById(req.params.id);
  res.status(210).json({ game: game });
});
function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
  }

  return newArray;
}
function newDeck(gameCards) {
  let cards = [];
  for (let i = 0; i < 25; i++) {
    let random = Math.floor(Math.random() * 279);
    !(cards.includes(random) || gameCards.includes(random))
      ? cards.push(random)
      : i--;
  }
  let deck = [];
  const startTeam = Math.random() <= 0.5 ? "blue" : "red";
  for (let i = 0; i < 9; i++) {
    if (i < 8) {
      shuffle(cards);
      const newBlueCard = new CardModel({
        img: cards.pop(),
        team: "blue",
      });
      const newRedCard = new CardModel({
        img: cards.pop(),
        team: "red",
      });
      deck.push(newBlueCard, newRedCard);
    } else {
      shuffle(cards);
      const lastCard = new CardModel({
        img: cards.pop(),
        team: startTeam,
      });
      const blackCard = new CardModel({
        img: cards.pop(),
        team: "black",
      });
      deck.push(lastCard, blackCard);
      while (cards.length > 0) {
        deck.push(
          new CardModel({
            img: cards.pop(),
            team: "gray",
          })
        );
      }
    }
  }
  return shuffle(deck);
}
