const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true, 
  timezone: 'Z',
  dateStrings: true
});

(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("MySQL pool ready");
  } catch (e) {
    console.error("DB connection failed:", e.message);
    process.exit(1);
  }
})();

process.on('SIGINT', async () => {
  try { await pool.end(); } finally { process.exit(0); }
});

module.exports = pool; // ili { pool, withTx } ako dodaš helper
