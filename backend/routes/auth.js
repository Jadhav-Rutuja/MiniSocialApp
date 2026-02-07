const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, profilePhoto } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash, profilePhoto });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// GET /auth/me -> get current logged-in user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash"); // exclude password
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE /auth/me -> update current user's profile (username, profilePhoto)
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { username, profilePhoto } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (profilePhoto !== undefined) updates.profilePhoto = profilePhoto;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-passwordHash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
