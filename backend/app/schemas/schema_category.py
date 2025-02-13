from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict 

class CategoryCreateDTO(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryUpdateDTO(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class CategoryResponseDTO(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        extra='allow'
    )