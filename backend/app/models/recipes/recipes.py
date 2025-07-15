from app.database import Base, mysql_db
from sqlalchemy import Column, Integer, String


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    

Base.metadata.create_all(bind=mysql_db.engine)