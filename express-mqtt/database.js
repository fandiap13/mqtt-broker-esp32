const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectToDatabase = async () => {
  try {
    await pool.getConnection();
    console.log(`Connected to ${process.env.MYSQL_DATABASE} database`);
    pool.releaseConnection();
  } catch (error) {
    console.error(
      `Error connecting to database: ${process.env.MYSQL_DATABASE}`,
      error
    );
  }
};

module.exports = {
  pool,
  connectToDatabase,
};
