from assets.Drone import Drone
from assets.Position import Position
from assets.Camera import Camera
from assets.Vine import Vine

import assets.mqtt.Drone as MQTT

import os
import cv2
import numpy as np
import gradio as gr

drone = Drone()
drone.trajet.start = Position(43.419647, 6.436672)
drone.trajet.end = Position(43.419582, 6.436941)

drone.trajet.add(Position(43.420293, 6.436965))
drone.trajet.add(Position(43.419907, 6.436972))

drone.fly = True

camera = Camera()

def detect_yellow(image_path):
    image = cv2.imread(image_path)
    if image is None:
        print("Erreur : impossible de charger l'image.")
        return False

    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    lower_yellow = np.array([20, 100, 100]) 
    upper_yellow = np.array([30, 255, 255])

    yellow_mask = cv2.inRange(hsv_image, lower_yellow, upper_yellow)

    yellow_count = cv2.countNonZero(yellow_mask)
    return yellow_count > 0

def capture_and_next_position():
    rgb, image = camera.shoot()
    
    temp_image_path = "temp_image.jpg"
    cv2.imwrite(temp_image_path, rgb)
    
    next_position = drone.trajet.next()
    hasYellow = detect_yellow(temp_image_path)
    
    detectMsg = "Une vigne malade a été détectée" if hasYellow else "Rien a été détécté"
    
    os.remove(temp_image_path)
    
    if next_position is None:
        if drone.fly:
            drone.fly = False
            MQTT.send(drone.getMsg())        
            return image, "Le drone retourne à la base", "NON OPERATIONNEL"
        
        else:
            return reset_drone()
    
    vine : Vine = Vine()
    vine.id = drone.getESPActuel()
    vine.sick = hasYellow
    
    drone.addVine(vine)    
    return image, f"Prochaine position : {next_position.lat}, {next_position.lon}", detectMsg

def reset_drone(): 
    drone.trajet.reset() 
    drone.fly = True
    drone.vines = []
    return None, "Drone réinitialisé", "Prêt à voler"

iface = gr.Interface(fn=capture_and_next_position, inputs=[], outputs=["image", "text", "text"], title="Prochaine destination")
iface.launch()
