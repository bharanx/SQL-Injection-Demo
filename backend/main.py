"""
==============================================================================
SQL INJECTION PREVENTION PLAYGROUND — FASTAPI REST API
==============================================================================
Provides structured API endpoints for the interactive cybersecurity lab:
- Login Lab (Vulnerable, Parameterized, ORM)
- Search Lab (Vulnerable, Parameterized, ORM)
- Input Validation Lab
- Database Explorer (Read-only users table)
- Health Status
==============================================================================
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db, get_raw_sqlite_connection
from models import User
from schemas import LoginRequest, UserPublicSchema
from seed import seed_database

from services.vulnerable_service import login_vulnerable, search_users_vulnerable
from services.parameterized_service import login_parameterized, search_users_parameterized
from services.orm_service import login_orm, search_users_orm
from services.validation_service import validate_input_fields


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes database tables and seeds dummy fictional test data on startup."""
    seed_database()
    yield


app = FastAPI(
    title="SQL Injection Prevention Playground API",
    description="Interactive Cybersecurity Training REST API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for React Frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", summary="Health Check")
@app.get("/", summary="Root Health Endpoint")
def health_check():
    return {
        "status": "online",
        "app": "SQL Injection Prevention Playground",
        "version": "2.0.0",
        "docs_url": "/docs"
    }


# ============================================================================
# LOGIN LAB ENDPOINTS
# ============================================================================

@app.post("/api/login/vulnerable", summary="Vulnerable Login (String Concatenation)")
@app.post("/login/vulnerable", include_in_schema=False)
def api_login_vulnerable(payload: LoginRequest):
    return login_vulnerable(payload.username, payload.password)


@app.post("/api/login/parameterized", summary="Parameterized Login (Prepared Statements)")
@app.post("/login/parameterized", include_in_schema=False)
def api_login_parameterized(payload: LoginRequest):
    return login_parameterized(payload.username, payload.password)


@app.post("/api/login/orm", summary="SQLAlchemy ORM Login")
@app.post("/login/orm", include_in_schema=False)
def api_login_orm(payload: LoginRequest, db: Session = Depends(get_db)):
    return login_orm(db, payload.username, payload.password)


# ============================================================================
# USER SEARCH LAB ENDPOINTS
# ============================================================================

@app.get("/api/users/vulnerable", summary="Vulnerable User Search (String Concatenation)")
def api_search_vulnerable(q: str = Query("", description="Search term")):
    return search_users_vulnerable(q)


@app.get("/api/users/parameterized", summary="Parameterized User Search")
def api_search_parameterized(q: str = Query("", description="Search term")):
    return search_users_parameterized(q)


@app.get("/api/users/orm", summary="SQLAlchemy ORM User Search")
def api_search_orm(q: str = Query("", description="Search term"), db: Session = Depends(get_db)):
    return search_users_orm(db, q)


# ============================================================================
# INPUT VALIDATION LAB ENDPOINTS
# ============================================================================

@app.post("/api/validate", summary="Input Validation Check")
@app.post("/validate-input", include_in_schema=False)
def api_validate(payload: dict):
    username = payload.get("username")
    email = payload.get("email")
    search = payload.get("search")
    return validate_input_fields(username=username, email=email, search=search)


# ============================================================================
# DATABASE VIEWER ENDPOINTS
# ============================================================================

@app.get("/api/database/users", response_model=List[UserPublicSchema], summary="Read-only Fictional Test Users Table")
@app.get("/users", response_model=List[UserPublicSchema], include_in_schema=False)
def get_database_users(db: Session = Depends(get_db)):
    """Returns safe list of fictional test users stored in SQLite (passwords excluded)."""
    return db.query(User).all()
