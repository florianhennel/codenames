const mongoose = require("mongoose");
const uri =
  "mongodb+srv://hennelflori:random123@cluster0.jqiuyf8.mongodb.net/codenames";
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
