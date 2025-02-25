from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Union
from app.models.model import User
from app.dao.dao_blog import BlogDAO
from app.schemas.schema_blog import BlogResponseDTO, BlogCreateDTO, BlogUpdateDTO
from app.dao import dao_user
from app.database.database import get_db

router = APIRouter(prefix="/blogs", tags=["blogs"])

@router.post("/", response_model=BlogResponseDTO)
async def create_blog(blog: BlogCreateDTO, current_user: User = Depends(dao_user.get_current_user), db: AsyncSession = Depends(get_db)):
    """Creates a new blog linked to the current user"""
    try:
        dao_blog = BlogDAO(db)
        new_blog = await dao_blog.create_blog(
            title=blog.title,
            content=blog.content,
            is_published = blog.is_published,
            category_id=blog.category_id,
            user_id=current_user.id
        )
        return new_blog
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail= f"Error creating blog {e}") from e

@router.get("/", response_model=List[BlogResponseDTO])
async def get_blogs(db: AsyncSession = Depends(get_db), current_user: User = Depends(dao_user.get_current_user)):
    """Fetches all blogs"""
    try:
        dao_blog = BlogDAO(db)
        blogs = await dao_blog.get_all_blogs()
        return blogs
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving blogs") from e

@router.put("/{blog_id}", response_model=BlogResponseDTO)
async def update_blog(blog_id: int, blog: BlogUpdateDTO, current_user: User = Depends(dao_user.get_current_user), db: AsyncSession = Depends(get_db)):
    """Updates a blog's title or content"""
    try:
        dao_blog = BlogDAO(db)
        existing_blog = await dao_blog.get_blogs_by_id(blog_id)
        if existing_blog is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
        if existing_blog.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this blog")

        updated_blog = await dao_blog.update_blog(
            blog_id=blog_id,
            title=blog.title,
            content=blog.content,
            is_published = blog.is_published,
            category_id=blog.category_id
        )
        return updated_blog
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail= f"Error updating blog {e}")

@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(blog_id: int, current_user: User = Depends(dao_user.get_current_user), db: AsyncSession = Depends(get_db)):
    """Deletes a blog by its ID"""
    try:
        dao_blog = BlogDAO(db)
        blog = await dao_blog.get_blogs_by_id(blog_id)
        if blog is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
        if blog.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this blog")

        await dao_blog.delete_blog(blog_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error deleting blog") from e

@router.get("/{id}/", response_model = Union[BlogResponseDTO, List[BlogResponseDTO]])
async def get_blog(
    id: int, 
    db: AsyncSession = Depends(get_db),get_type: str = Query(..., regex="^(USER|BLOG|CATG)$"),
    current_user: User = Depends(dao_user.get_current_user)
):
    """Fetches a blog by blog_id or user_id or category_id"""

    try:
        dao_blog = BlogDAO(db)
        if get_type == "USER":
            blogs = await dao_blog.get_blogs_by_user(id)
            if blogs is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No blogs found for this user_id")
            return blogs
        
        elif get_type == "BLOG":
            blog = await dao_blog.get_blogs_by_id(id)
            if blog is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No blogs found for this blog_id")
            return blog
        
        elif get_type == "CATG":
            blog = await dao_blog.get_blogs_by_category_id(id)
            if blog is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No blogs found for this category_id")
            return blog

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving blog") from e
