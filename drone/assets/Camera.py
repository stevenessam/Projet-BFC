import cv2

class Camera:
    
    def shoot(self):
        cap = cv2.VideoCapture(0)
            
        if not cap.isOpened():
            return "Erreur : Impossible d'ouvrir la webcam"
        
        ret, frame = cap.read()
        if not ret:
            return "Erreur : Impossible de capturer l'image"
        
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Ne pas convertir en RGB, garder l'image en BGR
        cap.release()
        cv2.destroyAllWindows()
        
        return frame, frame_rgb  # Retourner l'image en BGR
