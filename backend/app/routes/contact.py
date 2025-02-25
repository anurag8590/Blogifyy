from fastapi import APIRouter, Depends, HTTPException, status
from app.dao.dao_contact import ContactDAO
from app.schemas.schema_contact import ContactCreateDTO,ContactResponseDTO
from app.dao.get_dao import get_contact_dao

router = APIRouter(prefix="/contact", tags=["contact"])

@router.post("/", response_model = ContactResponseDTO)
async def create_contact(contact_data: ContactCreateDTO, dao_contact : ContactDAO = Depends(get_contact_dao)):
    
    try:
        contact = await dao_contact.create_contact(
            name=contact_data.name,
            email=contact_data.email,
            subject=contact_data.subject,
            message=contact_data.message
        )
        return contact
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail= f"Error creating contact {e}") from e