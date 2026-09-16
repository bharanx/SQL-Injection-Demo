"""
==============================================================================
SECURE IMPLEMENTATION 2: OBJECT-RELATIONAL MAPPING (SQLALCHEMY ORM)
==============================================================================

CONCEPT & MECHANICS:
Object-Relational Mapping (ORM) frameworks like SQLAlchemy allow developers to 
interact with database tables using Python objects instead of writing raw SQL code.

HOW ORM PREVENTS SQL INJECTION:
1. Automated Query Parameterization:
   When executing methods like `.filter(User.username == username)`, SQLAlchemy's 
   SQL Expression Language automatically constructs parameterized queries under 
   the hood using database placeholders (?).

2. Elimination of String Concatenation:
   Developers write Python object expressions rather than building SQL strings.

3. Developer Caveat / Best Practice:
   Using an ORM makes application code safe by default for standard queries. 
   However, developers must NOT pass concatenated strings into raw SQL execution 
   helpers (e.g., `db.execute(text(f"..."))`). Safe ORM usage requires relying on 
   ORM filter abstractions or parameter bindings.
==============================================================================
"""

from sqlalchemy.orm import Session
from models import User


def execute_orm_login(db: Session, username: str, password: str) -> dict:
    """
    Executes a secure login query using SQLAlchemy ORM filter expressions.
    
    SAFE PATTERN:
      user = db.query(User).filter(
          User.username == username,
          User.password == password
      ).first()
    """
    # Generated Query Representation for Educational Display
    orm_expression = "db.query(User).filter(User.username == username, User.password == password).first()"
    generated_sql = "SELECT users.id, users.username, users.email, users.role FROM users WHERE users.username = ? AND users.password = ?"

    try:
        # SQLAlchemy ORM handles parameter binding automatically
        user = db.query(User).filter(
            User.username == username,
            User.password == password
        ).first()

        user_data = None
        if user:
            user_data = user.to_dict()

        is_injection_attempt = ("'" in username or "OR" in username.upper() or "--" in username or "1=1" in username)

        if is_injection_attempt:
            msg = "SQL INJECTION PREVENTED BY ORM! SQLAlchemy automatically bound the input as a safe data parameter."
            exp = (
                "SECURITY SUCCESS: SQLAlchemy converted `User.username == username` into a bound parameter query. "
                f"The ORM searched for a record where username literally equaled '{username}', neutralizing the injection attempt."
            )
        elif user_data:
            msg = "Login successful with valid credentials using SQLAlchemy ORM."
            exp = "The ORM successfully constructed and executed a parameterized query, retrieving the matching user object."
        else:
            msg = "Login failed: No matching user found by ORM."
            exp = "The ORM executed a safe parameterized query, but no matching record was found."

        return {
            "technique": "SQLAlchemy ORM Framework",
            "status": "secure",
            "security_badge": "PROTECTED ✅",
            "success": user_data is not None,
            "input_received": {"username": username, "password": password},
            "query_executed": f"{orm_expression}\n--> Generates SQL: {generated_sql}",
            "parameters": {"username": username, "password": "********"},
            "validation_passed": True,
            "validation_errors": [],
            "user_found": user_data,
            "records_returned_count": 1 if user_data else 0,
            "message": msg,
            "explanation": exp
        }

    except Exception as err:
        return {
            "technique": "SQLAlchemy ORM Framework",
            "status": "error",
            "security_badge": "PROTECTED ✅",
            "success": False,
            "input_received": {"username": username, "password": password},
            "query_executed": orm_expression,
            "parameters": {"username": username, "password": "********"},
            "validation_passed": True,
            "validation_errors": [],
            "user_found": None,
            "records_returned_count": 0,
            "message": f"ORM Execution Error: {str(err)}",
            "explanation": "An unexpected error occurred during ORM query evaluation."
        }
