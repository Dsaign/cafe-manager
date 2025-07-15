from typing import Generator

from app.database import mysql_db
from sqlalchemy.orm import Session


def get_db() -> Generator[Session, None, None]:
    db = mysql_db.get_session()
    try:
        yield db
    finally:
        db.close()
