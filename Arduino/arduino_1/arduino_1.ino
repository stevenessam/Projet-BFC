const int rotaryPin1 = A0; // Rotary sensor pin for Arduino 1
const int ledPin1 = 4;    // LED pin for Arduino 1
int rotaryValue1;
String receivedDataFrom2 = "NULL"; // Default value if no data from Arduino 2
const String arduinoID = "ARDUINO_1"; // ID unique for Arduino 1

unsigned long previousMillis1 = 0; // Timer for data sending
const unsigned long interval1 = 10000; // 30 seconds interval

void setup() {
  pinMode(ledPin1, OUTPUT);  // Set LED pin as output
  Serial.begin(9600);        // Communication with Arduino 2 and Arduino Master
}

void loop() {
  unsigned long currentMillis1 = millis();

  // Check if data is available from Arduino 2
  if (Serial.available() > 0) {
    // Read the data sent by Arduino 2
    receivedDataFrom2 = Serial.readStringUntil('\n');
  }

  // Check if it's time to send data
  if (currentMillis1 - previousMillis1 >= interval1) {
    previousMillis1 = currentMillis1;

    // Turn on the LED to indicate data sending
    digitalWrite(ledPin1, HIGH);

    // Read the value from the rotary sensor
    rotaryValue1 = analogRead(rotaryPin1);
    rotaryValue1 = map(rotaryValue1, 0, 675, 0, 100);

    // Send data to Arduino Master
    Serial.print(arduinoID);
    Serial.print(": ");
    Serial.print(rotaryValue1);
    Serial.print(" ");
    Serial.println(receivedDataFrom2);

    // Reset receivedDataFrom2 to "NULL" in case the connection is lost
    receivedDataFrom2 = "ARDUINO_2: NULL";

    // Keep LED on for 3 seconds
    delay(3000);

    // Turn off the LED
    digitalWrite(ledPin1, LOW);
  }
}
