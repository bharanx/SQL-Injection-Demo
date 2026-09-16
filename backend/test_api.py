"""
Automated pytest suite for SQL Injection Prevention Playground backend services.
"""

from fastapi.testclient import TestClient
from main import app
from seed import seed_database

client = TestClient(app)


def setup_module(module):
    """Seed SQLite database before tests."""
    seed_database()


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "online"


def test_vulnerable_login_bypass():
    payload = {"username": "admin' --", "password": "wrongpassword"}
    response = client.post("/api/login/vulnerable", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["security"] == "unsafe"
    assert data["user_found"]["username"] == "admin"


def test_parameterized_login_protected():
    payload = {"username": "admin' --", "password": "wrongpassword"}
    response = client.post("/api/login/parameterized", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["security"] == "protected"
    assert data["user_found"] is None


def test_orm_login_protected():
    payload = {"username": "' OR '1'='1", "password": "wrongpassword"}
    response = client.post("/api/login/orm", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["security"] == "protected"


def test_vulnerable_search_bypass():
    response = client.get("/api/users/vulnerable?q=' OR '1'='1")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["users"]) >= 5


def test_parameterized_search_protected():
    response = client.get("/api/users/parameterized?q=' OR '1'='1")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["users"]) == 0  # Searches literally for string "' OR '1'='1"


def test_validation_endpoint():
    payload = {"username": "admin' --", "email": "invalid_email"}
    response = client.post("/api/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert len(data["errors"]) > 0


def test_database_users_viewer():
    response = client.get("/api/database/users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 5
    for user in users:
        assert "password" not in user
