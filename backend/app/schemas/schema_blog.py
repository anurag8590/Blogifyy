from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.schema_user import UserResponseDTO
from app.schemas.schema_category import CategoryResponseDTO
from app.schemas.schema_comment import CommentResponseDTO

class BlogCreateDTO(BaseModel):
    title: str
    content: str
    is_published : bool
    category_id: Optional[int] = 1

class BlogUpdateDTO(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_published : Optional[bool] = None
    category_id: Optional[int] = None

class BlogResponseDTO(BaseModel):
    blog_id: int
    title: str
    content: str
    is_published : Optional[bool] = None
    created_at: datetime
    modified_at: datetime
    user_id: int
    category_id: Optional[int]
    name : Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True,
        extra='allow'
    )

class BlogDetailResponseDTO(BlogResponseDTO):
    user: UserResponseDTO
    category: Optional[CategoryResponseDTO]
    comments: List[CommentResponseDTO] = []

    model_config = ConfigDict(
        from_attributes=True,
        extra='allow'
    )
