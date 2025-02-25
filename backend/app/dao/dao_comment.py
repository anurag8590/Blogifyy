from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from typing import Optional
from app.models.model_comment import Comment

class CommentDAO:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_comment(self, content: str, blog_id: int, user_id: int) -> Comment:

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

        result = await (self.db.execute(select(Comment).filter(Comment.comment_id == comment_id)))
        return result.scalars().first()

    async def update_comment(self, comment_id: int, content: str) -> Optional[Comment]:

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

        query = select(Comment).filter(Comment.comment_id == comment_id)
        result = await self.db.execute(query)
        comment = result.scalar_one_or_none()

        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")

        await self.db.delete(comment)
        await self.db.commit()
    
    async def get_comments_by_blog_id(self, blog_id: int):

        result = await self.db.execute(select(Comment).where(Comment.blog_id == blog_id))
        return result.scalars().all()