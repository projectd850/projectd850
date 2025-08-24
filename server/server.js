const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS konfiguracija za HTTP Only cookies
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Automatski učitavanje svih ruta iz modules/*/
const modulesPath = path.join(__dirname, "modules");

fs.readdirSync(modulesPath).forEach((moduleFolder) => {
  const routeFile = path.join(modulesPath, moduleFolder, `${moduleFolder}Routes.js`);
  if (fs.existsSync(routeFile)) {
    const route = require(routeFile);
    app.use(`/api/${moduleFolder}`, route);
  }
});

// Test ruta
app.get("/", (req, res) => {
  res.send("ProjectFocus backend is running.");
});

// Pokretanje servera
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  pool.getConnection()
    .then((connection) => {
      console.log("✅ MySQL database connected!");
      connection.release();
    })
    .catch((err) => {
      console.error("❌ Failed to connect to MySQL:", err.message);
    });
});
