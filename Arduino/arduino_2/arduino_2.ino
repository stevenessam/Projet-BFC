const int rotaryPin2 = A0; // Rotary sensor pin for Arduino 2
const int ledPin2 = 4;    // LED pin for Arduino 2
int rotaryValue2;
const String arduinoID = "ARDUINO_2"; // ID unique pour Arduino 2

unsigned long previousMillis2 = 0; // Timer for data sending
const unsigned long interval2 = 10000; // 30 seconds interval

void setup() {
  pinMode(ledPin2, OUTPUT);  // Set LED pin as output
  Serial.begin(9600);        // Communication avec Arduino 1
}

void loop() {
  unsigned long currentMillis2 = millis();

  if (currentMillis2 - previousMillis2 >= interval2) {
    previousMillis2 = currentMillis2;

    // Turn on the LED
    digitalWrite(ledPin2, HIGH);

    // Read the value from the rotary sensor
    rotaryValue2 = analogRead(rotaryPin2);
    rotaryValue2 = map(rotaryValue2, 0, 1023, 0, 100);


    // Send the value with the ID
    Serial.print(arduinoID);
    Serial.print(": ");
    Serial.println(rotaryValue2);

    // Keep LED on for 3 seconds
    delay(3000);

    // Turn off the LED
    digitalWrite(ledPin2, LOW);
  }
}
