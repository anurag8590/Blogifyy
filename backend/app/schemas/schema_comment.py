from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class CommentCreateDTO(BaseModel):
    content: str
    blog_id: int

class CommentUpdateDTO(BaseModel):
    content: Optional[str] = None

class CommentResponseDTO(BaseModel):
    comment_id: int
    content: str
    created_at: datetime
    modified_at: datetime
    user_id: int
    blog_id: int

    model_config = ConfigDict(
        from_attributes=True,
        extra='allow'
    )