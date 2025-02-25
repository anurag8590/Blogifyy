from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.dao.dao_user import UserDAO
from app.schemas.schema_user import UserCreateDTO, RefreshTokenDTO
from app.dao.get_dao import get_user_dao
import jwt

router = APIRouter(tags=["auth"])

@router.post("/register/")
async def create_user(user_data: UserCreateDTO, dao_user : UserDAO = Depends(get_user_dao)):

    try:
        created_user = await dao_user.create_user(user_data.username, user_data.password,user_data.email)

        if created_user is None:
            raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        ) 

        return {"message": "User created successfully"}

    except Exception as e:
        print(f"Error in token generation: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Server Error: {str(e)}",
        ) from e

@router.post("/token/")
async def token(user: OAuth2PasswordRequestForm = Depends(), dao_user : UserDAO = Depends(get_user_dao)):

    try:
        user_retrieved = await dao_user.authenticate_user(user.username, user.password)

        if user_retrieved is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

        access_token = dao_user.create_access_token({"sub": user_retrieved.username})
        refresh_token = dao_user.create_refresh_token({"user": user_retrieved.username})

        return {"access_token": access_token, 
                "refresh_token":refresh_token,
                "token_type": "bearer",
                "user_id":user_retrieved.id,
                "username":user_retrieved.username,
                "email":user_retrieved.email}

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Internal Server Error: {str(e)}") from e

@router.post("/refresh/")
async def refresh_token(refresh_data: RefreshTokenDTO, dao_user : UserDAO = Depends(get_user_dao)):

    try:
        payload = dao_user.verify_refresh_token(refresh_data.refresh_token)
        username = payload.get("user")

        if not username:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        new_access_token = dao_user.create_access_token({"user": username})

        return {"access_token": new_access_token, "token_type": "bearer"}
    
    except HTTPException as e:
        raise e