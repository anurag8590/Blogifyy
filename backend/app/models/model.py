from datetime import datetime
from typing import List, Optional
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship, backref
from app.database.database import Base
from sqlalchemy.sql import text

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=False, index=False, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String)

    blogs: Mapped[List["Blog"]] = relationship(back_populates="user")
    comments: Mapped[List["Comment"]] = relationship(back_populates="user")

class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    slug: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default =text('now()'),nullable=True)

    blogs: Mapped[List["Blog"]] = relationship(back_populates="category")

class Blog(Base):
    __tablename__ = "blog"

    blog_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=False)
    modified_at: Mapped[datetime] = mapped_column(DateTime, server_default = text('now()'), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default = text('now()'),nullable=True)
    
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    category_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("categories.id"), index=True)

    user: Mapped["User"] = relationship(back_populates="blogs")
    category: Mapped["Category"] = relationship(back_populates="blogs")
    comments: Mapped[List["Comment"]] = relationship(back_populates="blog", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default =text('now()'),nullable=True)
    modified_at: Mapped[datetime] = mapped_column(DateTime, server_default =text('now()'),nullable=True)
    
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    blog_id: Mapped[int] = mapped_column(Integer, ForeignKey("blog.blog_id"), index=True)
    parent_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("comments.id"), index=True)

    user: Mapped["User"] = relationship(back_populates="comments")
    blog: Mapped["Blog"] = relationship(back_populates="comments")
    replies: Mapped[List["Comment"]] = relationship(
        "Comment",
        backref=backref("parent", remote_side=[id]),
        cascade="all, delete-orphan"
    )