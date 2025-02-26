from sqlalchemy import select
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.models.model_blog import Blog
from app.models.model_category import Category
from sqlalchemy.orm import aliased
from sqlalchemy.exc import SQLAlchemyError
 
class BlogDAO:
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_all_blogs(self) -> List[Blog]:

        result = await self.db.execute(select(Blog).filter(Blog.is_published == True))
        return result.scalars().all()
 
    async def create_blog(self, title: str, content: str, is_published : bool, category_id : int, user_id: int):
    
        try:
            new_blog = Blog(title = title, content = content, is_published = is_published, category_id = category_id, user_id = user_id)
            self.db.add(new_blog)
            await self.db.commit()
            await self.db.refresh(new_blog)
            return new_blog
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e
 
    async def get_blogs_by_id(self, blog_id: int):

        result = await self.db.execute( select(Blog).filter(Blog.blog_id == blog_id))
        return result.scalars().first()
 
    async def get_blogs_by_user(self, user_id: int):

        result = await self.db.execute( select(Blog).filter(Blog.user_id == user_id))

        return result.scalars().all()
 
    async def update_blog(self, blog_id: int, title: str, is_published : bool, content: str, category_id : int):

        try :
            blog = await self.get_blogs_by_id(blog_id)
            if blog:
                blog.title = title if title else blog.title 
                blog.content = content if content else blog.content
                blog.is_published = is_published
                blog.category_id = category_id if category_id else blog.category_id
                await self.db.commit()
                await self.db.refresh(blog)
            return blog
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e
 
    async def delete_blog(self, blog_id: int):

        try:
            blog = await self.get_blogs_by_id(blog_id)
            if blog:
                await self.db.delete(blog)
                await self.db.commit()
            return blog
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e
        
    async def get_blogs_by_category_id(self, category_id : int):

        CategoryAlias = aliased(Category)

        result = await self.db.execute(
            select(
                Blog.blog_id, 
                Blog.title, 
                Blog.content, 
                Blog.is_published, 
                Blog.created_at, 
                Blog.modified_at, 
                Blog.user_id, 
                Blog.category_id, 
                CategoryAlias.name.label("category_name")
            )
            .join(CategoryAlias, Blog.category_id == CategoryAlias.category_id)
            .filter(Blog.category_id == category_id)
        )

        blogs = [
        {
            "blog_id": row.blog_id,
            "title": row.title,
            "content": row.content,
            "is_published": row.is_published,
            "created_at": row.created_at,
            "modified_at": row.modified_at,
            "user_id": row.user_id,
            "category_id": row.category_id,
            "name": row.category_name,
        }
        for row in result.all()
        ]
        
        return blogs

    async def search_blogs( self, search_query: str):
     
        query = select(Blog)

        if search_query:
            terms = search_query.strip().split()
            search_conditions = [or_(Blog.title.ilike(f"%{term}%"), Blog.content.ilike(f"%{term}%")) for term in terms]
            query = query.filter(*search_conditions)

        query = query.order_by(Blog.created_at.desc()).filter(Blog.is_published == True)
        
        result = await self.db.execute(query)
        blogs = result.scalars().all()

        return blogs