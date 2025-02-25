from pydantic import BaseModel, EmailStr

class ContactCreateDTO(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactResponseDTO(ContactCreateDTO):
    id: int

    class Config:
        from_attributes = True
