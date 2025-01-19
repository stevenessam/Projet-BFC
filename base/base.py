import requests
import paho.mqtt.client as mqtt
import re

MQTT_BROKER = "broker.emqx.io"  
MQTT_PORT = 1883                    
MQTT_TOPICS = [("arduino/data", 0), ("bfc/drone", 0)]  

SERVER_URL_ARDUINO = "http://192.168.137.1/api/data"
SERVER_URL_DRONE = "http://192.168.137.1/api/sick"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"Connecté au broker MQTT {MQTT_BROKER}:{MQTT_PORT}")
        for topic, qos in MQTT_TOPICS:
            client.subscribe(topic, qos)
            print(f"Abonné au sujet : {topic}")
    else:
        print(f"Échec de connexion. Code de retour : {rc}")

def process_arduino_message(payload):
    match = re.search(r"ARDUINO_1: (\S+) ARDUINO_2: (\S+)", payload)
    if match:
        esp_1 = match.group(1)
        esp_2 = match.group(2)

        # Remplacer NULL par une valeur par défaut ou None
        esp_1 = int(esp_1) if esp_1.isdigit() else None
        esp_2 = int(esp_2) if esp_2.isdigit() else None

        data = {
            "MASTER": "OK",
            "ESP_1": esp_1,
            "ESP_2": esp_2
        }
        print(f"Données extraites : {data}")

        response = requests.post(SERVER_URL_ARDUINO, json=data)
        if response.status_code == 200:
            print(f"Données envoyées avec succès : {response.json()}")
        else:
            print(f"Erreur lors de l'envoi des données : {response.status_code}, {response.text}")
    else:
        print("Format de message non valide ou valeurs manquantes")

def process_drone_message(payload):
    try:
        pairs = payload.split('&')
        data = {}
        for pair in pairs:
            key, value = pair.split(':')
            key = int(key)
            value = int(value) if value.isdigit() else None  # Gérer NULL
            data[f"ESP_{key + 1}"] = value

        print(f"Données formatées pour drone : {data}")
        response = requests.post(SERVER_URL_DRONE, json=data)
        if response.status_code == 200:
            print(f"Données drone envoyées avec succès : {response.json()}")
        else:
            print(f"Erreur lors de l'envoi des données drone : {response.status_code}, {response.text}")
    except Exception as e:
        print(f"Erreur lors du traitement du message drone : {e}")

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode('utf-8')
        print(f"Message reçu sur {msg.topic} : {payload}")

        if msg.topic == "arduino/data":
            process_arduino_message(payload)
        elif msg.topic == "bfc/drone":
            process_drone_message(payload)
        else:
            print("Sujet non géré")
    except Exception as e:
        print(f"Erreur lors du traitement du message : {e}")

client = mqtt.Client()

client.on_connect = on_connect
client.on_message = on_message

try:
    print(f"Connexion au broker MQTT {MQTT_BROKER}:{MQTT_PORT}...")
    client.connect(MQTT_BROKER, MQTT_PORT)
    
    client.loop_forever()
except Exception as e:
    print(f"Erreur : {e}")
