const String arduinoMasterID = "ARDUINO_MASTER_1"; // Unique ID for Arduino Master
unsigned long previousMillisMaster = 0; // Timer for data reception
const unsigned long waitTime = 10000;  // 30 seconds (Arduino 1's send interval)
const unsigned long timeout = 5000;    // Additional 5-second timeout

void setup() {
  Serial.begin(9600); // Communication with Arduino 1
}

void loop() {
  unsigned long currentMillisMaster = millis();
  String receivedData = "";

  // Check if data is available from Arduino 1
  while (Serial.available() > 0) {
    receivedData = Serial.readStringUntil('\n');
    previousMillisMaster = currentMillisMaster; // Reset the timer when data is received
  }

  // Check if the total wait time (30 seconds + 5 seconds) has elapsed without receiving data
  if (currentMillisMaster - previousMillisMaster >= (waitTime + timeout)) {
    // Send NULL values to indicate connection loss
    Serial.print(arduinoMasterID);
    Serial.print(": ");
    Serial.print("ARDUINO_1: NULL ");
    Serial.println("ARDUINO_2: NULL");

    // Reset the timer to avoid repeated NULL messages
    previousMillisMaster = currentMillisMaster;
  }

  // If data was received, forward it with the Master ID
  if (receivedData != "") {
    Serial.print(arduinoMasterID);
    Serial.print(": ");
    Serial.println(receivedData);
  }

  delay(500); // Small delay for stability
}
