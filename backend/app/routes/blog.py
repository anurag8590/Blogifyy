from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Union
from app.models.model_user import User
from app.dao.dao_blog import BlogDAO
from app.schemas.schema_blog import BlogResponseDTO, BlogCreateDTO, BlogUpdateDTO
from app.dao.get_dao import get_blog_dao
from app.dao.get_dao import get_current_user

router = APIRouter(prefix="/blogs", tags=["blogs"])

@router.post("/", response_model=BlogResponseDTO)
async def create_blog(blog: BlogCreateDTO, current_user: User = Depends(get_current_user), dao_blog : BlogDAO = Depends(get_blog_dao)):

    try:
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
async def get_blogs(dao_blog : BlogDAO = Depends(get_blog_dao), current_user: User = Depends(get_current_user)):

    try:
        blogs = await dao_blog.get_all_blogs()
        return blogs
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving blogs") from e

@router.put("/{blog_id}", response_model=BlogResponseDTO)
async def update_blog(blog_id: int, blog: BlogUpdateDTO, current_user: User = Depends(get_current_user), dao_blog : BlogDAO = Depends(get_blog_dao)):

    try:
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
async def delete_blog(blog_id: int, current_user: User = Depends(get_current_user), dao_blog : BlogDAO = Depends(get_blog_dao)):

    try:
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
    get_type: str = Query(..., regex="^(USER|BLOG|CATG)$"),
    current_user: User = Depends(get_current_user),
    dao_blog : BlogDAO = Depends(get_blog_dao)
):

    try:
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