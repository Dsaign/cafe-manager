from logging import getLogger
from typing import Generator, Optional

from app.database import mysql_db
from sqlalchemy.orm import Session

logger = getLogger(__name__)

def get_db() -> Generator[Session, None, None]:
    """Dependency to get a database session."""
    db = mysql_db.get_session()
    try:
        yield db
    finally:
        db.close()

def add_and_commit(db: Optional[Session], item) -> bool:
    """Add an item to the database and commit the transaction.
    Returns True if successful, False otherwise."""
    if not db:
        raise ValueError("Database session is not available")
    try:
        db.add(item)
        db.commit()
        db.refresh(item)
    except Exception as e:
        db.rollback()
        logger.warning(f"Error adding and committing item: {e}")
        return False
    return True