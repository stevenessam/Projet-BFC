import paho.mqtt.client as mqtt
from configparser import ConfigParser
import threading
import sys

config = ConfigParser()
config.read('../config.ini')

broker = config['MQTT']['broker']
port = int(config['MQTT']['port'])
topic = config['DRONE']['topic']

clientMQTT = None

def on_connect(client, userdata, flags, reason_code, properties) -> None:
    global clientMQTT
    print(f"Connected MQTT DRONE with result code {reason_code}")
    clientMQTT = client
    client.subscribe(topic)

def send(msg):
    clientMQTT.publish(topic, msg)

def mqtt_loop():
    global broker
    
    mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    mqttc.on_connect = on_connect
    try:
        mqttc.connect(broker, port, 60)
    except:
        if broker != config['BASE']['broker']:
            print('Il y a un problème avec le coud, tentative d econnexion avec la base...')
            broker = config['BASE']['broker']
            mqtt_loop()
        else:
            print("Il y a un problème avec le cloud et la base")
            sys.exit("Erreur critique : Impossible de se connecter ni au cloud ni à la base. Le programme va maintenant se terminer.")
            
    mqttc.loop_forever()

mqtt_thread = threading.Thread(target=mqtt_loop)
mqtt_thread.start()
