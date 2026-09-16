from sqlalchemy import Column, Integer, String
from database import Base


class User(Base):
    """
    User SQLAlchemy Model mapped to the 'users' database table.
    
    Fields:
      - id: Unique primary key identifier
      - username: Unique username used for login authentication
      - password: Password string (stored securely/hashed in real apps)
      - email: User's contact email address
      - role: User role (e.g. 'admin', 'student', 'faculty', 'researcher')
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False, default="user")

    def to_dict(self):
        """
        Convert user instance to safe dictionary excluding sensitive fields like password.
        """
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role
        }
