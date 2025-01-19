class Position:
    lon : float = 0
    lat : float = 0
    
    def __init__(self, lon : int, lat : int):
        self.lon = lon
        self.lat = lat