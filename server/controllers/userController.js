const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// POST /api/users/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, type } = req.body;

    // 1. All fields required
    if (!name || !email || !password || !confirmPassword || !phone || !type) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 2. Password must match confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // 3. Valid user type
    if (!["admin", "ordinary"].includes(type)) {
      return res.status(400).json({ success: false, message: "User type must be admin or ordinary" });
    }

    // 4. Email must not already exist
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // 5. Hash password and save
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, phone, type });

    res.status(201).json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/users/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Create JWT token valid for 1 day
    const token = jwt.sign(
      { id: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/users  (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // never send passwords
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { signup, login, getAllUsers };