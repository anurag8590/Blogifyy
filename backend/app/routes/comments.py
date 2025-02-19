from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.models.model import User
from app.dao.dao_comment import CommentDAO
from app.schemas.schema_comment import CommentResponseDTO, CommentCreateDTO, CommentUpdateDTO
from app.dao import dao_user
from app.database.database import get_db

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("/", response_model=CommentResponseDTO)
async def create_comment(comment: CommentCreateDTO, current_user: User = Depends(dao_user.get_current_user), db: AsyncSession = Depends(get_db)):
    """Creates a new comment linked to the current user"""
    try:
        dao_comment = CommentDAO(db)
        new_comment = await dao_comment.create_comment(
            content=comment.content,
            blog_id=comment.blog_id,
            user_id=current_user.id
        )
        return new_comment
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail = f"Error creating comment {e}") from e

@router.get("/{comment_id}")
async def get_comment_by_id(comment_id: int, db: AsyncSession = Depends(get_db)):
    """Fetches a comment by its ID"""
    try:
        dao_comment = CommentDAO(db)
        comment = await dao_comment.get_comment_by_id(comment_id)
        if comment is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
        return comment
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving comment {e}") from e

@router.put("/{comment_id}", response_model=CommentResponseDTO)
async def update_comment(comment_id: int, comment: CommentUpdateDTO, current_user: User = Depends(dao_user.get_current_user), db: AsyncSession = Depends(get_db)):
    """Updates a comment's content"""
    try:
        dao_comment = CommentDAO(db)
        existing_comment = await dao_comment.get_comment_by_id(comment_id)
        if existing_comment is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
        if existing_comment.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this comment")

        updated_comment = await dao_comment.update_comment(
            comment_id=comment_id,
            content=comment.content
        )
        return updated_comment
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating comment {e}") from e

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(comment_id: int, db: AsyncSession = Depends(get_db)):
    """Deletes a comment by its ID"""
    try:
        dao_comment = CommentDAO(db)
        comment = await dao_comment.get_comment_by_id(comment_id)
        if comment is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
        # if comment.user_id != current_user.id:
        #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this comment")

        await dao_comment.delete_comment(comment_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error deleting comment") from e
    
@router.get("/blogs/{blog_id}/comments", response_model=List[CommentResponseDTO])
async def get_comments_for_blog(blog_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(dao_user.get_current_user)):
    """Fetch all comments for a specific blog"""
    try:
        dao_comment = CommentDAO(db)
        comments = await dao_comment.get_comments_by_blog_id(blog_id)
        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comments: {e}")
