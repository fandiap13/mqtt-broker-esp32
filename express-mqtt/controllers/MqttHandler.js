const mqtt = require("mqtt");
const sensorDht = require("./SensorDHT");

const MqttHandler = {
  mqttClient: null,
  host: "https://test.mosquitto.org",
  port: 1883,
  username: "", // mqtt credentials if these are needed to connect
  password: "",
  async connect() {
    this.mqttClient = mqtt.connect(`${this.host}:${this.port}`, {
      username: this.username,
      password: this.password,
    });

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });
    
    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log(`mqtt client connected`);
      // mqtt subscriptions
      this.mqttClient.subscribe("fandicoba/temphum", { qos: 0 });
      // mqtt get messages
      this.mqttClient.on("message", async function (topic, message) {
        const {temp, hum} = JSON.parse(message.toString()); 
        await sensorDht.saveDataSensor({topic, temp, hum});
      });
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  },

  // Sends a mqtt message to topic: mytopic
  sendMessage(message) {
    this.mqttClient.publish("fandicoba/temphum", message);
  },
};

module.exports = MqttHandler;
