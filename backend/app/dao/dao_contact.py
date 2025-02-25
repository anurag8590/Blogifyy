from sqlalchemy.ext.asyncio import AsyncSession
from app.models.model_contact import Contact

class ContactDAO:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_contact(self, name: str, email: str, subject: str, message: str) -> Contact:

        new_contact = Contact(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        self.db.add(new_contact)
        await self.db.commit()
        await self.db.refresh(new_contact)
        
        return new_contact

   