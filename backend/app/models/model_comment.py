from datetime import datetime
from sqlalchemy import Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from sqlalchemy.sql import text
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.model_blog import Blog
    from app.models.model_user import User

class Comment(Base):
    __tablename__ = "comments"

    comment_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=text('now()'), nullable=False)
    modified_at: Mapped[datetime] = mapped_column(DateTime, server_default=text('now()'), onupdate=text('now()'), nullable=False)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    blog_id: Mapped[int] = mapped_column(Integer, ForeignKey("blogs.blog_id"), index=True)

    user: Mapped["User"] = relationship("User", back_populates="comments")
    blog: Mapped["Blog"] = relationship("Blog", back_populates="comments")