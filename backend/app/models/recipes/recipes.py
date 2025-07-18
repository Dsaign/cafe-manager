from app.database import Base, mysql_db
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column


class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[str] = mapped_column(String, nullable=True)

Base.metadata.create_all(bind=mysql_db.engine)
