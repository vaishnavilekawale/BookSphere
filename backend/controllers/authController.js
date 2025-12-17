const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ===========================
// REGISTER USER
// ===========================
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, password" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    user = await User.create({ name, email, password });

    return res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===========================
// LOGIN USER
// ===========================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===========================
// GET LOGGED-IN USER
// ===========================
exports.getMe = async (req, res, next) => {
  try {
    return res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};


//  const jwt = require('jsonwebtoken');
//  const User = require('../models/User');
//  const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
//  expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
//  exports.register = async (req, res, next) => {
//  try {
//  const { name, email, password } = req.body;
//  if (!name || !email || !password) return res.status(400).json({ message:
//  'Please provide name, email, password' });
//  let user = await User.findOne({ email });
//  if (user) return res.status(400).json({ message: 'User already exists' });
//  user = await User.create({ name, email, password });
//  res.status(201).json({ token: generateToken(user._id), user: { id:
//  user._id, name: user.name, email: user.email, role: user.role } });
//  } catch (err) {
//  next(err);
//  }
 
// };
//  exports.login = async (req, res, next) => {
//  try {
//  const { email, password } = req.body;
//  if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });
//  const user = await User.findOne({ email });
//  if (!user || !(await user.matchPassword(password))) return
//  res.status(401).json({ message: 'Invalid credentials' });
//  res.json({ token: generateToken(user._id), user: { id: user._id, name:
//  user.name, email: user.email, role: user.role } });
//  } catch (err) {
//  next(err);
//  }
//  };
//  exports.getMe = async (req, res, next) => {
//  try {
//  const user = req.user;
//  res.json({ user });
//  } catch (err) {
//  next(err);
//  }
//  };