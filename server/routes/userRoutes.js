const express = require("express");
const router = express.Router();
const { signup, login, getAllUsers } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/", protect, adminOnly, getAllUsers);

module.exports = router;