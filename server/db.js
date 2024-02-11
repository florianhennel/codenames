const mongoose = require("mongoose");
require('dotenv').config();
const uri = process.env.MONGODB_URI;
let dbConnection;
module.exports = {
  connectToDb: async (cb) => {
    try {
      mongoose.connect(uri);
      dbConnection = mongoose.connection;
      dbConnection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
        return cb(err);
      });
      dbConnection.once("open", () => {
        return cb();
      });
    } catch (err) {
      console.error(err);
      return cb(err);
    }
  },
  getDb: () => dbConnection,
};
