from typing import Optional
from pydantic import BaseModel, ConfigDict 

class CategoryCreateDTO(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryUpdateDTO(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class CategoryResponseDTO(BaseModel):
    category_id: int
    name: str
    description: Optional[str] = None
    user_id : int

    model_config = ConfigDict(
        from_attributes=True,
        extra='allow'
    )