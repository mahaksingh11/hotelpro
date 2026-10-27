const express = require("express");
const router = express.Router();
const {
  addRoom,
  getAllRooms,
  getAvailableRooms,
  getRoomById,
} = require("../controllers/roomController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getAllRooms);
router.get("/available", getAvailableRooms); // must come BEFORE "/:id"
router.get("/:id", getRoomById);
router.post("/addroom", protect, adminOnly, addRoom);

module.exports = router;