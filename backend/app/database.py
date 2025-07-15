import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import CursorResult, Engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL não definida no .env")

class CafeDatabase:
    engine: Engine
    SessionLocal: sessionmaker

    def __init__(self, connection_url: str):
        self.engine = create_engine(
            connection_url,
            pool_size=20,
            pool_recycle=3600,
            pool_pre_ping=True,
            execution_options={"no_parameters": True},
            echo=False,
        )
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def execute(self, *args, **kwargs) -> CursorResult:
        with self.engine.connect() as connection:
            result = connection.execute(*args, **kwargs)
            if result is None:
                raise RuntimeError("Database execution returned None instead of CursorResult")
            return result

    def get_session(self) -> Session:
        return self.SessionLocal()

Base = declarative_base()
mysql_db = CafeDatabase(DATABASE_URL)
Base.metadata.create_all(bind=mysql_db.engine)
