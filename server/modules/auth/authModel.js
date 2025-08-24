const pool = require("../../config/db");

// Pronađi korisnika po email adresi
const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0]; // Vraća jednog korisnika (ili undefined)
};

// Kreiraj novog korisnika
const createUser = async (name, email, hashedPassword) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );
  return result;
};

module.exports = {
  findUserByEmail,
  createUser,
};
