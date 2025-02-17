from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional
from app.models.model import Category

class CategoryDAO:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_category(self, name: str, description: Optional[str] = None) -> Category:
        """
        Creates a new category in the database.
        
        Args:
            name: The name of the category
            description: Optional description of the category
            
        Returns:
            The newly created Category object
            
        Raises:
            SQLAlchemyError: If there's an error during database operation
        """
        try:
            new_category = Category(name=name, description=description)
            self.db.add(new_category)
            await self.db.commit()
            await self.db.refresh(new_category)
            return new_category
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e

    async def get_all_categories(self) -> List[Category]:
        """
        Retrieves all categories from the database.
        
        Returns:
            List of Category objects
            
        Raises:
            SQLAlchemyError: If there's an error during database operation
        """
        try:
            query = select(Category)
            result = await self.db.execute(query)
            categories = result.scalars().all()
            return categories
        except SQLAlchemyError as e:
            raise e

    async def get_category_by_id(self, category_id: int) -> Optional[Category]:
        """
        Retrieves a category by its ID.
        
        Args:
            category_id: The ID of the category to retrieve
            
        Returns:
            Category object if found, None otherwise
            
        Raises:
            SQLAlchemyError: If there's an error during database operation
        """
        try:
            query = select(Category).where(Category.category_id == category_id)
            result = await self.db.execute(query)
            category = result.scalar_one_or_none()
            return category
        except SQLAlchemyError as e:
            raise e

    async def update_category(
        self, 
        category_id: int, 
        name: Optional[str] = None, 
        description: Optional[str] = None
    ) -> Optional[Category]:
        """
        Updates an existing category.
        
        Args:
            category_id: The ID of the category to update
            name: Optional new name for the category
            description: Optional new description for the category
            
        Returns:
            Updated Category object if found, None otherwise
            
        Raises:
            SQLAlchemyError: If there's an error during database operation
        """
        try:
            category = await self.get_category_by_id(category_id)
            if category is None:
                return None

            if name is not None:
                category.name = name
            if description is not None:
                category.description = description

            await self.db.commit()
            await self.db.refresh(category)
            return category
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e

    async def delete_category(self, category_id: int) -> bool:
        """
        Deletes a category by its ID.
        
        Args:
            category_id: The ID of the category to delete
            
        Returns:
            True if category was deleted, False if category was not found
            
        Raises:
            SQLAlchemyError: If there's an error during database operation
        """
        try:
            category = await self.get_category_by_id(category_id)
            if category is None:
                return False

            await self.db.delete(category)
            await self.db.commit()
            return True
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e