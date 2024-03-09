from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from .database import Base

# class Item(Base):
#     __tablename__ = "items"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String(50), index=True)
#     description = Column(String(255), index=True)
#     owner_id = Column(Integer, ForeignKey("users.id"))

#     owner = relationship("User", back_populates="items")


class Image(Base):
    __tablename__ = "image"
    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String(255), unique=True)
    


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    userEmail = Column(String(30), unique=True, index=True)
    userNickname = Column(String(30), unique=True, index=True)
    hashed_password = Column(String(100))

    webtoon = relationship("Webtoon", back_populates="user")
    


class Webtoon(Base):
    __tablename__ = "webtoon"

    webtoon_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    webtoon_name = Column(String(50), index=True)
    webtoon_created_at = Column(DateTime, index=True)

    user = relationship("User", back_populates="webtoon")
    content_img = relationship("ContentImg", back_populates="webtoon")
    pose_img = relationship("PoseImg", back_populates="webtoon")
    model = relationship("Model", uselist=False, back_populates="webtoon")


class ContentImg(Base):
    __tablename__ = "content_img"

    original_image_id = Column(Integer, primary_key=True, index=True)
    webtoon_id = Column(Integer, ForeignKey("webtoon.webtoon_id"), nullable=False)
    created_at = Column(DateTime, index=True)
    original_image_url = Column(String(100), index=True)
    asset_name = Column(String(50), index=True)
    description = Column(String(255), index=True)
    model_id = Column(Integer, index=True)

    webtoon = relationship("Webtoon", back_populates="content_img")
    background_img = relationship("BackgroundImg", back_populates="content_img")


class PoseImg(Base):
    __tablename__ = "pose_img"

    pose_image_id = Column(Integer, primary_key=True, index=True)
    webtoon_id = Column(Integer, ForeignKey("webtoon.webtoon_id"), nullable=False)
    pose_image_url = Column(String(255), index=True)
    created_at = Column(DateTime, index=True)
    asset_name = Column(String(50), index=True)
    description = Column(String(255), index=True)

    webtoon = relationship("Webtoon", back_populates="pose_img")

class BackgroundImg(Base):
    __tablename__ = "background_img"

    background_image_id = Column(Integer, primary_key=True, index=True)
    webtoon_id = Column(Integer, ForeignKey("content_img.webtoon_id"), nullable=False)
    background_image_url = Column(String(255), index=True)

    content_img = relationship("ContentImg", back_populates="background_img")


class Model(Base):
    __tablename__ = "model"

    model_id = Column(Integer, primary_key=True, index=True)
    webtoon_id = Column(Integer, ForeignKey("webtoon.webtoon_id"), nullable=False)
    model_path = Column(String(255), index=True)

    webtoon = relationship("Webtoon", back_populates="model")