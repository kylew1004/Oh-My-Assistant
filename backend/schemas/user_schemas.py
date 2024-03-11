from pydantic import BaseModel


class EmailPasswordRequestForm(BaseModel):
    userEmail: str
    userPassword: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    userEmail: str
    userId: int
    userNickname: str

class UserBase(BaseModel):
    userEmail: str


class UserCreate(UserBase):
    userPw: str
    userNickname: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True