const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const mqttClient = require("./controllers/MqttHandler");
const sensorDht = require("./controllers/SensorDHT");

const sensorDhtModel = require("./models/SensorDHTModel");

const db = require("./database");

const port = 3000; // Ganti dengan port yang sesuai
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function inits() {
  // connect to database
  await db.connectToDatabase();
  // create table
  await sensorDhtModel.createTable();
  // mqtt connect
  await mqttClient.connect();
}

inits();

app.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Calculate start index for pagination
    const startIndex = (page - 1) * pageSize;
    const items = await sensorDht.getDataSensor(pageSize, startIndex);
    const totalItems = await sensorDht.totalPages();
    const totalPages = Math.ceil(totalItems / pageSize);

    const responseJson = {
      page,
      pageSize,
      totalItems,
      totalPages,
      items,
    };

    res.status(200).json(responseJson);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
