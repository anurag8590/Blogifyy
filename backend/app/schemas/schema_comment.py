from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class CommentCreateDTO(BaseModel):
    content: str
    blog_id: int
    parent_id: Optional[int] = None

class CommentUpdateDTO(BaseModel):
    content: str

class CommentResponseDTO(BaseModel):
    id: int
    content: str
    created_at: datetime
    modified_at: datetime
    user_id: int
    blog_id: int
    parent_id: Optional[int]
    replies: List['CommentResponseDTO'] = []

    model_config = ConfigDict(
        from_attributes=True,
        extra='allow'
    )