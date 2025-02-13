from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.model import User
from app.dao.dao_blog import BlogDAO
from app.schemas.schema_blog import BlogResponseDTO,BlogCreateDTO
from app.dao import dao_user
from app.database.database import get_db
from typing import List

router = APIRouter(prefix="/blog")


@router.post("/", response_model = BlogResponseDTO)
async def create_blog(blog: BlogCreateDTO, current_user: User = Depends(dao_user.get_current_user), db: AsyncSession = Depends(get_db)):
    """Creates a new blog linked to the current user"""
    try:
        dao_blog = BlogDAO(db)
        new_blog = await dao_blog.create_blog(
            title = blog.title,
            content = blog.content,
            category_id = blog.category_id,
            user_id = current_user.id
        )
        
        return new_blog
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error creating blog") from e


@router.get("/all", response_model=List[BlogResponseDTO])
async def get_blogs(current_user: User = Depends(dao_user.get_current_user), db: AsyncSession = Depends(get_db)):
    """Fetches all blogs created by the current user"""
    try:
        dao_blog = BlogDAO(db)
        blogs = await dao_blog.get_blogs_by_user(current_user.id)
        return blogs
    except HTTPException as http_exception:
        raise http_exception
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving blogs")


@router.get("/{blog_id}", response_model=BlogResponseDTO)
async def get_blogs_by_id(blog_id: int, current_user: User = Depends(dao_user.get_current_user), db: AsyncSession = Depends(get_db)):
    """Fetches a Blog by its ID"""
    try:
        dao_blog = BlogDAO(db)
        blog = await dao_blog.get_blogs_by_id(blog_id)
        if blog is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
        if blog.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this blog")
        return blog
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving blog")


@router.put("/{blog_id}", response_model=BlogResponseDTO)
async def update_blog(blog_id: int, blog: BlogCreateDTO, current_user: User = Depends(dao_user.get_current_user), db: AsyncSession = Depends(get_db)):
    """Updates a blog's title or content """
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
            content=blog.content
        )
        return updated_blog
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error updating blog")


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
        return {"message": "Blog successfully deleted"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error deleting blog")