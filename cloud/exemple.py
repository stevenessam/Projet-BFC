import requests
import random

r = requests.post('http://localhost/api/data', json={
   "MASTER": "OK",
   "ESP_1": 0, # master 1 (arduino relié au pc)
   "ESP_2": random.randint(0, 100), # arduino derriere master 1
   "ESP_3": random.randint(0, 100) # arduino au fond
})

r = requests.post('http://localhost/api/sick', json={
   "ESP_2": random.randint(0, 1),
   "ESP_3": random.randint(0, 1)
})