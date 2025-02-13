from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from app.models.model import User
from app.database import database
from dotenv import load_dotenv
import os
import jwt

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS"))
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class UserDAO:
    def __init__(self, db: Session):
        self.db = db
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    async def create_user(self, username: str, password: str, email:str):
        """Creates a new user in the database"""
        try:
            hashed_password = self.pwd_context.hash(password)
            user = User(username=username, hashed_password=hashed_password,email = email)
            
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)
            
            return user

        except IntegrityError:
            await self.db.rollback()
            return None 

        except SQLAlchemyError as e:
            await self.db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}")

    async def get_user_by_username(self, username: str):
        """Retrieves a user by username"""
        try:
            result = await self.db.execute( select(User).filter(User.username == username))    #returns Result Object [(User,)]
            return result.scalars().first()   #converts it to [User] and .first returns the User or it will return None
        except SQLAlchemyError as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}") from e

    async def authenticate_user(self, username: str, password: str):
        """Authenticates a user by verifying password"""
        try:
            user = await self.get_user_by_username(username)
            if user and self.pwd_context.verify(password, user.hashed_password):
                return user
            return None
        except SQLAlchemyError as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}") from e

    def create_access_token(self, data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
        """Generates a JWT access token"""
        try:
            to_encode = data.copy()
            expire = datetime.now(timezone.utc) + expires_delta
            to_encode.update({"exp": expire})
            return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        except jwt.PyJWTError as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Token generation error: {str(e)}") from e
    def decode_access_token(self, token: str):
        """Decodes and validates the JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.PyJWTError:
            return None

    def create_refresh_token(self, data: dict, expires_delta: timedelta = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)):
        """Generate a refresh token"""
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + expires_delta
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)
    
    def verify_refresh_token(self, token: str):
        """Decode and verify refresh token"""
        try:
            return jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        except jwt.ExpiredSignatureError as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired") from e
        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from e
            
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)) -> User:
    """Dependency that fetches the current user based on the provided token."""
    user_dao = UserDAO(db)
    
    payload = user_dao.decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    db_user =await  user_dao.get_user_by_username(payload.get("sub"))
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user