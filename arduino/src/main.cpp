#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define WIFI_SSID "P"
#define WIFI_PASSWORD "fandiaziz"
String mqttBroker = "test.mosquitto.org";

WiFiClient client;
PubSubClient mqtt(client);

// deklarasi fungsi
void connectToWifi();
void connectMQTT();

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on topic: ");
  Serial.println(topic);

  Serial.print("Message: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}


void setup()
{
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  randomSeed(analogRead(0)); 
  connectToWifi();
  mqtt.setServer(mqttBroker.c_str(), 1883);
  mqtt.setCallback(callback);
}

void loop()
{
  if (WiFi.status() != WL_CONNECTED) {
    connectToWifi();
  }

  if(!mqtt.connected()) {
    connectMQTT();
  }
  DynamicJsonDocument doc(200);
  doc["temp"] = String(random(120));
  doc["hum"] = String(random(120));

  String sensorValue;
  serializeJson(doc, sensorValue);

  mqtt.publish("fandicoba/temphum", sensorValue.c_str());
  Serial.println(sensorValue);
  mqtt.loop();
  delay(10000);
}

void connectMQTT() {
  while (!mqtt.connected())
  {
    Serial.println("Connecting to mqtt...");
    if (mqtt.connect("fandicoba")) {
      // mqtt.subscribe("fandicoba/temphum");
      // mqtt.publish("fandicoba/temphum", "anak anj - " + i);
      Serial.println("MQTT connected");
    }
  }  
}

void connectToWifi()
{
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("Connecting to wifi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }

  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("Wifi Connected");
  Serial.println(WiFi.SSID());
  Serial.println(WiFi.RSSI());
  Serial.println(WiFi.macAddress());
  Serial.println(WiFi.localIP());
  Serial.println(WiFi.gatewayIP());
  Serial.println(WiFi.dnsIP());
}

