const express = require("express");
const router = express.Router();
const {
  bookRoom,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/bookroom", protect, bookRoom);
router.get("/my", protect, getMyBookings);
router.get("/", protect, adminOnly, getAllBookings);
router.post("/cancelbooking", protect, cancelBooking);

module.exports = router;