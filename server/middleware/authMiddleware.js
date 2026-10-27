const jwt = require("jsonwebtoken");

// Checks that the request has a valid login token
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, please log in" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, type } - available in the controller
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token, please log in again" });
  }
};

// Allows only admins through (use after protect)
const adminOnly = (req, res, next) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access only" });
  }
  next();
};

module.exports = { protect, adminOnly };