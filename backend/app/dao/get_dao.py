from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import  AsyncSession
from app.dao.dao_category import CategoryDAO
from app.dao.dao_blog import BlogDAO
from app.dao.dao_comment import CommentDAO
from app.dao.dao_contact import ContactDAO
from app.dao.dao_user import UserDAO
from app.database.database import get_db
from fastapi.security import OAuth2PasswordBearer
from app.models.model_user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_category_dao(db: AsyncSession = Depends(get_db)) -> CategoryDAO:
    return CategoryDAO(db)

def get_blog_dao(db: AsyncSession = Depends(get_db)) -> BlogDAO:
    return BlogDAO(db)

def get_comment_dao(db: AsyncSession = Depends(get_db)) -> CommentDAO:
    return CommentDAO(db)

def get_contact_dao(db: AsyncSession = Depends(get_db)) -> ContactDAO:
    return ContactDAO(db)

def get_user_dao(db: AsyncSession = Depends(get_db)) -> UserDAO:
    return UserDAO(db)

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    
    user_dao = UserDAO(db)
    
    payload = user_dao.decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    db_user = await  user_dao.get_user_by_username(payload.get("sub"))
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user
