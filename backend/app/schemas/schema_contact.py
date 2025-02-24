from pydantic import BaseModel, EmailStr
from typing import Optional

class ContactCreateSchema(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactResponseSchema(ContactCreateSchema):
    id: int

    class Config:
        from_attributes = True  # Enables ORM mode
