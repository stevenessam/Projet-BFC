import serial
import paho.mqtt.client as mqtt

# Configuration du port série
PORT = "COM6"  # Remplacez par votre port série Arduino
BAUD_RATE = 9600

# Configuration MQTT
MQTT_BROKER = "broker.emqx.io"  # Serveur public Eclipse Mosquitto
MQTT_PORT = 1883                    # Port MQTT standard
MQTT_TOPIC = "arduino/data"         # Sujet MQTT pour envoyer les données

try:
    # Initialisation du port série
    ser = serial.Serial(PORT, BAUD_RATE, timeout=1)
    print(f"Connexion série établie sur {PORT} à {BAUD_RATE} baud.")

    # Initialisation du client MQTT
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT)
    print(f"Connecté au broker MQTT {MQTT_BROKER}:{MQTT_PORT}")

    # Boucle principale pour lire et envoyer les données
    while True:
        # Lire une ligne depuis le port série
        data = ser.readline().decode('utf-8').strip()
        if data:
            print(f"Données reçues : {data}")

            # Publier les données sur le sujet MQTT
            client.publish(MQTT_TOPIC, data)
            print(f"Données envoyées à MQTT : {data}")

except serial.SerialException as e:
    print(f"Erreur série : {e}")
except Exception as e:
    print(f"Erreur : {e}")
finally:
    if 'ser' in locals() and ser.is_open:
        ser.close()
        print("Connexion série fermée.")