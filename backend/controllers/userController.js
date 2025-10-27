const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        message: "User already exists",
        error: true,
        success: false,
      });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({
      message: "User Registered",
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      error: true,
      success: false,
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "User does not exists",
        error: true,
        success: false,
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Incorrect Password",
        error: true,
        success: false,
      });
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({
      message: "Login Successful",
      token,
      user,
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      error: true,
      success: false,
    });
  }
};

module.exports = { register, login };
