from logging import getLogger
from typing import Generator

from app.database import mysql_db
from sqlalchemy.orm import Session

logger = getLogger(__name__)

def get_db() -> Generator[Session, None, None]:
    db = mysql_db.get_session()
    try:
        yield db
    finally:
        db.close()

def add_and_commit(db: Session, item) -> bool:
    try:
        db.add(item)
        db.commit()
        db.refresh(item)
    except Exception as e:
        db.rollback()
        logger.warning(f"Error adding and committing item: {e}")
        return False
    return True