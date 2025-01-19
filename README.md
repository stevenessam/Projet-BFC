# Projet BFC

Le projet BFC est composé de quatres sous projet.

## Installation
### Base
Nécessite python >= 3
```sh
cd base
pip3 install -r requirements.txt # linux
python -m pip install -r requirements.txt # windows
```
### Drone
Nécessite python >= 3
```sh
cd drone
pip3 install -r requirements.txt # linux
python -m pip install -r requirements.txt # windows
```
### Cloud
Nécessite [Node.JS](https://nodejs.org/fr)
```sh
cd cloud
npm install
```
### Arduino
1. **Python 3.x**
2. Installez les dépendances :
   ```bash
   pip install pyserial paho-mqtt
3. Installez Arduino IDE
## Utilisation
### Base
```sh
cd base
python3 base.py
```
### Drone
```sh
cd drone
python3 app.py
```
### Cloud
```sh
cd cloud
node app.js
```
Il faut ensuite aller sur http://localhost/
### Arduino
1. Dans le dossier Arduino, vous trouverez un dossier pour chaque Arduino : Arduino 1, Arduino 2 et Arduino Master.

2. Ouvrez le code correspondant dans l'Arduino IDE et téléchargez-le sur chaque Arduino.

- Arduino 2 : Utilisez le port `COM4`
- Arduino 1 : Utilisez le port `COM5`
- Arduino Master : Utilisez le port `COM6`

3. Arduino 1 et Arduino 2 : Connectez un potentiomètre à la broche A0 pour lire la variation de résistance et une LED à la broche 4

#### Câblage entre les Arduinos :

1. Connectez un câble entre le TX de Arduino 2 et le RX de Arduino 1 pour permettre la communication série.
2. Connectez un autre câble entre le TX de Arduino 2 et le RX de Arduino Master pour établir la communication entre les Arduinos.

#### Utilisation du Script Python
Lancez le script Python : Une fois tous les Arduinos allumés, lancez le script sendDataMQTT.py qui se trouve dans le dossier Arduino avec la commande suivante :
```
python sendDataMQTT.py
```