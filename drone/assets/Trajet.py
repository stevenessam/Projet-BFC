from assets.Position import Position
from typing import List

class Trajet:
    start : Position = None
    checkpoints : List[Position] = []
    end : Position = None
    index : int = 0
    
    def next(self) -> Position:
        if self.index < len(self.checkpoints):
            self.index += 1
            return self.checkpoints[self.index - 1]
        
        return None
    
    def add(self, position : Position) -> None:
        self.checkpoints.append(position)
        
    def reset(self) -> None:
        self.index = 0