from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from typing import TYPE_CHECKING
from app.database.database import Base

if TYPE_CHECKING:
    from app.database.database import Base

class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    subject: Mapped[str] = mapped_column(String, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
