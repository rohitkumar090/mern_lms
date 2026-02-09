const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
const registerUser = async (req, res) => {

  try {
    const { userName, userEmail, password } = req.body;

    // 1️⃣ Validation
    if (!userName || !userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 2️⃣ Check existing user
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      userEmail,
      password: hashPassword,
      role: "student", 
    });

    await newUser.save();

    const accessToken = jwt.sign(
      {
        _id: newUser._id,
        userName: newUser.userName,
        userEmail: newUser.userEmail,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "120m" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered & logged in successfully",
      data: {
        accessToken,
        user: {
          _id: newUser._id,
          userName: newUser.userName,
          userEmail: newUser.userEmail,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= LOGIN ================= */
const loginUser = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    if (!userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const checkUser = await User.findOne({ userEmail });

    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "120m" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
        },
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

module.exports = { registerUser, loginUser };