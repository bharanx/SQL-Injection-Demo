from pydantic import BaseModel, Field, field_validator, ConfigDict
import re
from typing import Optional, List, Dict, Any


class LoginRequest(BaseModel):
    """
    Standard login request payload without strict pre-validation.
    Used by vulnerable, parameterized, and ORM endpoints to demonstrate raw input handling.
    """
    username: str = Field(..., description="User's username input")
    password: str = Field(..., description="User's password input")


class ValidatedLoginRequest(BaseModel):
    """
    Strictly validated login request payload using Pydantic.
    Demonstrates Input Validation (Defense in Depth).
    
    Validation Rules:
      - Username: 3 to 30 characters, alphanumeric & underscores only.
      - Password: 8 to 50 characters.
    """
    username: str = Field(..., min_length=3, max_length=30)
    password: str = Field(..., min_length=8, max_length=50)

    @field_validator("username")
    @classmethod
    def validate_username_characters(cls, value: str) -> str:
        # Regex allowing only letters, numbers, and underscores
        pattern = r"^[a-zA-Z0-9_]{3,30}$"
        if not re.match(pattern, value):
            raise ValueError(
                "Username contains unsupported characters. Only letters, numbers, and underscores are allowed."
            )
        return value


class ValidationTestRequest(BaseModel):
    """
    Request model for the /validate-input test route.
    Allows testing arbitrary username and password strings against input validation rules.
    """
    username: str
    password: str


class UserPublicSchema(BaseModel):
    """
    Safe public schema for user data. Excludes password field.
    """
    id: int
    username: str
    email: str
    role: str

    model_config = ConfigDict(from_attributes=True)


class SecurityResponse(BaseModel):
    """
    Standardized API response payload for security lab demonstrations.
    Includes educational insights into executed queries, validation status, and security notes.
    """
    technique: str
    status: str  # 'vulnerable' | 'secure' | 'validation_failed' | 'error'
    security_badge: str  # 'UNSAFE' | 'PROTECTED' | 'DEFENSE IN DEPTH'
    success: bool
    input_received: Dict[str, Any]
    query_executed: str
    parameters: Optional[Any] = None
    validation_passed: bool = True
    validation_errors: List[str] = []
    user_found: Optional[UserPublicSchema] = None
    records_returned_count: int = 0
    message: str
    explanation: str
