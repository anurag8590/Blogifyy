from pydantic import BaseModel, EmailStr, ConfigDict

class UserCreateDTO(BaseModel):
    username: str
    email: EmailStr
    password: str

    model_config = ConfigDict(
        from_attributes=True,
        extra='allow'
    )

class UserResponseDTO(BaseModel):
    id: int
    username: str
    email: EmailStr

    model_config = ConfigDict(
        from_attributes=True,
        extra='allow'
    )

class RefreshTokenDTO(BaseModel):
    
    model_config = ConfigDict(
        from_attributes=True,
        extra='allow'
    )

    refresh_token: str