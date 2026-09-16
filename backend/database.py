import sqlite3
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Path to SQLite database file
DB_PATH = os.path.join(os.path.dirname(__file__), "sql_lab.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Create SQLAlchemy Engine
# check_same_thread=False is required for SQLite in FastAPI's multi-threaded worker environment
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Session factory for ORM database operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base for ORM Models
Base = declarative_base()


def get_db():
    """
    FastAPI Dependency to yield an active SQLAlchemy DB Session per request.
    Ensures proper cleanup and closing of sessions.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_raw_sqlite_connection():
    """
    Helper function to get a raw sqlite3 connection object.
    Used for demonstrating raw parameter binding and educational vulnerable string queries.
    Configured with sqlite3.Row for dict-like column access.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
