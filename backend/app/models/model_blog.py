from datetime import datetime
from typing import List, Optional,TYPE_CHECKING
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from sqlalchemy.sql import text

if TYPE_CHECKING:
    from app.models.model_user import User
    from app.models.model_category import Category
    from app.models.model_comment import Comment

class Blog(Base):
    __tablename__ = "blogs"

    blog_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=False)
    modified_at: Mapped[datetime] = mapped_column(DateTime, server_default=text('now()'), onupdate=text('now()'), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=text('now()'), nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    category_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("categories.category_id"), index=True)

    user: Mapped["User"] = relationship("User", back_populates="blogs")
    category: Mapped[Optional["Category"]] = relationship("Category", back_populates="blogs")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="blog", cascade="all, delete-orphan")