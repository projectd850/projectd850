const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("./authModel");

// Registracija korisnika
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await authModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await authModel.createUser(name, email, hashedPassword);

    return res.status(201).json({
      message: "User registered successfully!",
      userId: newUser.insertId,
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login korisnika sa HTTP-only cookie
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authModel.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Postavi token kao HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // koristi secure samo u produkciji
      sameSite: "Strict",
      maxAge: 2 * 60 * 60 * 1000, // 2 sata
    });

    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, loginUser };
