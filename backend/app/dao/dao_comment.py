from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from typing import List, Optional
from app.models.model import Comment

class CommentDAO:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_comment(self, content: str, blog_id: int, user_id: int) -> Comment:

        """Creates a new comment"""

        new_comment = Comment(
            content=content,
            blog_id=blog_id,
            user_id=user_id
        )
        self.db.add(new_comment)
        await self.db.commit()
        await self.db.refresh(new_comment)
        return new_comment

    async def get_comment_by_id(self, comment_id: int) -> Optional[Comment]:
        
        """Fetches a comment by ID"""

        result = await (self.db.execute(select(Comment).filter(Comment.comment_id == comment_id)))
        return result.scalars().first()

    # async def get_comments_by_blog_id(self, blog_id: int) -> List[Comment]:
    #     """Fetches all comments for a blog"""
    #     query = (
    #         select(Comment)
    #         .options(
    #             selectinload(Comment.user),
    #             selectinload(Comment.blog)
    #         )
    #         .filter(Comment.blog_id == blog_id)
    #         .order_by(Comment.created_at)
    #     )
    #     result = await self.db.execute(query)
    #     return result.scalars().all()

    async def update_comment(self, comment_id: int, content: str) -> Optional[Comment]:

        """Updates a comment's content"""

        query = select(Comment).filter(Comment.comment_id == comment_id)
        result = await self.db.execute(query)
        comment = result.scalar_one_or_none()
        
        if comment:
            comment.content = content
            await self.db.commit()
            await self.db.refresh(comment)
            return comment
        return None

    async def delete_comment(self, comment_id: int) -> None:

        """Deletes a comment by ID"""

        query = select(Comment).filter(Comment.comment_id == comment_id)
        result = await self.db.execute(query)
        comment = result.scalar_one_or_none()

        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")

        await self.db.delete(comment)
        await self.db.commit()
    
    async def get_comments_by_blog_id(self, blog_id: int):

        """Retrieve all comments for a given blog"""

        result = await self.db.execute(select(Comment).where(Comment.blog_id == blog_id))
        return result.scalars().all()