from datetime import datetime
from typing import List, Optional
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, Boolean, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from sqlalchemy.sql import text

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)

    blogs: Mapped[List["Blog"]] = relationship("Blog", back_populates="user", cascade="all, delete-orphan")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="user", cascade="all, delete-orphan")

class Category(Base):
    __tablename__ = "categories"

    category_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    description: Mapped[Optional[str]] = mapped_column(Text)

    blogs: Mapped[List["Blog"]] = relationship("Blog", back_populates="category", cascade="all, delete-orphan")

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

class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    subject: Mapped[str] = mapped_column(String, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
