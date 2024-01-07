const { pool } = require("../database");

const createTable = async () => {
  const createSensorDhtTable = `
        CREATE TABLE IF NOT EXISTS sensor_dht (
            id INT AUTO_INCREMENT PRIMARY KEY,
            date DATETIME,
            topic VARCHAR(255) NOT NULL,
            temp FLOAT,
            hum FLOAT
        )
`;

  await pool
    .query(createSensorDhtTable)
    .then(() => console.log("sensor_dht table created successfully"))
    .catch((err) => {
      if (err) {
        console.error("Error creating sensor_dht table:", err);
        return;
      }
    });
};

module.exports = {
  createTable,
};
