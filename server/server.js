const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("HotelPro API is running");
});

// Routes will be added here, e.g.
 app.use("/api/users", require("./routes/userRoutes"));
 app.use("/api/rooms", require("./routes/roomRoutes"));

// Start server after DB connects
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});