const mongoose = require("mongoose");
const playerSchema = new mongoose.Schema({
  name: String,
  role: {
    type: String,
    enum: ["spymaster", "operative"],
    default: "operative",
  },
  team: {
    type: String,
    enum: ["red", "blue"],
    default: "blue",
  },
});
const cardSchema = new mongoose.Schema({
  img: String,
  team: {
    type: String,
    enum: ["red", "blue", "gray", "black"],
    default: "gray",
  },
});
const CardModel = mongoose.model("Card", cardSchema);
const teamSchema = new mongoose.Schema({
  cardsLeft: Number,
  players: [playerSchema],
});
const logSchema = new mongoose.Schema({
  text: String,
  player: playerSchema,
});
const TeamModel = mongoose.model("Team", teamSchema);
const PlayerModel = mongoose.model("Player", playerSchema);
const clueSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
});
const ClueModel = mongoose.model("Clue", clueSchema);
const roomSchema = new mongoose.Schema({
  revealedCards: [String],
  startTeam: String,
  game_log: [logSchema],
  cards: [cardSchema],
  players: [playerSchema],
  blueTeam: teamSchema,
  redTeam: teamSchema,
  activeClue: Boolean,
  tries: Number,
  admin: String,
  currentClue: clueSchema,
  currentTeam: String,
});
const RoomModel = mongoose.model("Room", roomSchema);

module.exports = { RoomModel, PlayerModel, CardModel, TeamModel, ClueModel };
