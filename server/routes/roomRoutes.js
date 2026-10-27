const express = require("express");
const router = express.Router();
const { addRoom, getAllRooms, getRoomById } = require("../controllers/roomController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.post("/addroom", protect, adminOnly, addRoom);

module.exports = router;