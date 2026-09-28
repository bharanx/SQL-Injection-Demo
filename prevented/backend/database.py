from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./prevented_demo.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

import time
from sqlalchemy import event

def mock_sleep(seconds):
    time.sleep(seconds)
    return 1

def mock_http_get(url):
    try:
        from models import OOBDemoEvent
        db = SessionLocal()
        event_record = OOBDemoEvent(url=url, timestamp=str(time.time()))
        db.add(event_record)
        db.commit()
        db.close()
    except:
        pass
    return 1

@event.listens_for(engine, "connect")
def connect(dbapi_connection, connection_record):
    dbapi_connection.create_function("sleep", 1, mock_sleep)
    dbapi_connection.create_function("http_get", 1, mock_http_get)
