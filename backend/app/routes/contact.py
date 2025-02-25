from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.dao.dao_contact import ContactDAO
from app.schemas.schema_contact import ContactCreateDTO,ContactResponseDTO

router = APIRouter(prefix="/contact", tags=["contact"])

@router.post("/", response_model = ContactResponseDTO)
async def create_contact(contact_data: ContactCreateDTO, db: AsyncSession = Depends(get_db)):
    
    contact_dao = ContactDAO(db)
    contact = await contact_dao.create_contact(
        name=contact_data.name,
        email=contact_data.email,
        subject=contact_data.subject,
        message=contact_data.message
    )
    return contact
