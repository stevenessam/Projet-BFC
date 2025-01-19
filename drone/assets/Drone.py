from assets.Trajet import Trajet
from typing import List
from assets.Vine import Vine

class Drone:
    trajet : Trajet = Trajet()
    fly : bool = False
    vines : List[Vine] = []
    
    def getESPActuel(self) -> int:
        index : int = self.trajet.index - 1
        
        if index >= len(self.trajet.checkpoints):
            return -1
        
        return index
    
    def addVine(self, vine : Vine) -> None:
        self.vines.append(vine)
        
    def getMsg(self) -> str:
        res = "&0:0"
        
        for i in range(len(self.vines)):
            vine = self.vines[i]
            res += f"&{vine.id + 1}:{1 if vine.sick else 0}"
            
        if len(res) > 0:
            res = res[1:]
            
        print(res)
        return res