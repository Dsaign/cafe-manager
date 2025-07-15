from datetime import date

from app.database import Base
from sqlalchemy import Column, Integer, String


class Ingredients(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False)
    unit = Column(String, nullable=False)
    date_added = Column(String, default=date.today().strftime("%Y-%m-%d"), nullable=False)
    
