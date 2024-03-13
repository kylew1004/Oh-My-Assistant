from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    userEmail = Column(String(30), unique=True, index=True)
    userNickname = Column(String(30), index=True)
    hashed_password = Column(String(100))

    webtoon = relationship("Webtoon", back_populates="user")
    

class Webtoon(Base):
    __tablename__ = "webtoon"
    id = Column(Integer, primary_key=True, index=True)
    webtoonName = Column(String(50), index=True)
    userId = Column(Integer, ForeignKey("users.id"), nullable=False)
    createdAt = Column(DateTime, index=True)

    user = relationship("User", back_populates="webtoon")
    content_img = relationship("ContentImg", back_populates="webtoon")
    pose_img = relationship("PoseImg", back_populates="webtoon")
    model = relationship("Model", uselist=False, back_populates="webtoon")


class ContentImg(Base):
    __tablename__ = "content_img"

    originalImageId = Column(Integer, primary_key=True, index=True)
    webtoonId = Column(Integer, ForeignKey("webtoon.id"), nullable=False)
    created_at = Column(DateTime, index=True)
    original_image_url = Column(String(255), index=True)
    asset_name = Column(String(50), index=True)
    description = Column(String(255), index=True)

    webtoon = relationship("Webtoon", back_populates="content_img")
    background_img = relationship("BackgroundImg", back_populates="content_img")


class PoseImg(Base):
    __tablename__ = "pose_img"

    id = Column(Integer, primary_key=True, index=True)
    webtoonId = Column(Integer, ForeignKey("webtoon.id"), nullable=False)
    originalCharacterImgUrl = Column(String(255), index=True)
    originalPoseImgUrl = Column(String(255), index=True)
    characterImgUrl = Column(String(255), index=True)
    poseImgUrl = Column(String(255), index=True)
    createdAt = Column(DateTime, index=True)
    assetName = Column(String(50), index=True, unique=True)
    description = Column(String(255), index=True)

    webtoon = relationship("Webtoon", back_populates="pose_img")

class BackgroundImg(Base):
    __tablename__ = "background_img"

    id = Column(Integer, primary_key=True, index=True)
    original_image_id = Column(Integer, ForeignKey("content_img.originalImageId"), nullable=False)
    backgroundImgUrl = Column(String(255), index=True)

    content_img = relationship("ContentImg", back_populates="background_img")


class Model(Base):
    __tablename__ = "model"

    id = Column(Integer, primary_key=True, index=True)
    webtoonId = Column(Integer, ForeignKey("webtoon.id"), nullable=False)
    modelPath = Column(String(255), index=True)

    webtoon = relationship("Webtoon", back_populates="model")