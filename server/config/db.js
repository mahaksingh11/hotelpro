const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("DB connection error:", err.message);
    process.exit(1); // stop the server if the DB can't connect
  }
};

module.exports = connectDB;