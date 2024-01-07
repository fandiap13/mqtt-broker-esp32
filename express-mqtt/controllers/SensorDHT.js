const { pool } = require("../database");

const getDataSensor = async (pageSize, startIndex) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sensor_dht ORDER BY date DESC LIMIT ? OFFSET ?",
      [pageSize, startIndex]
    );
    return result[0];
  } catch (error) {
    console.log(error);
  } finally {
    pool.releaseConnection();
  }
};

const totalPages = async () => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) as totalCount FROM sensor_dht"
    );
    return result[0].totalCount;
  } catch (error) {
    console.log(error);
  } finally {
    pool.releaseConnection();
  }
};

const saveDataSensor = async ({ topic, temp, hum }) => {
  try {
    const currentDate = new Date();
    const result = await pool.query(
      "INSERT INTO sensor_dht (date, topic, temp, hum) VALUES (?, ?, ?, ?)",
      [currentDate, topic, temp, hum]
    );
    console.log(`save data dht successfully (${result[0].insertId})`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getDataSensor,
  totalPages,
  saveDataSensor,
};
