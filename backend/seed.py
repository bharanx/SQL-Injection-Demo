"""
==============================================================================
DATABASE SEEDING SCRIPT
==============================================================================
Creates the 'users' table in SQLite and populates it with safe, fictional 
test accounts for local laboratory testing.

IMPORTANT SECURITY NOTICE:
- All accounts populated here are 100% fictional test data for local lab use.
- No real credentials, names, or external system data are used.
==============================================================================
"""

from database import engine, SessionLocal, Base
from models import User


# Fictional Test Accounts
SEED_USERS = [
    {
        "username": "admin",
        "password": "AdminPass123!",
        "email": "admin@cyberlab.local",
        "role": "admin"
    },
    {
        "username": "alice_smith",
        "password": "AlicePass2026!",
        "email": "alice@cyberlab.local",
        "role": "student"
    },
    {
        "username": "bob_jones",
        "password": "BobPass2026!",
        "email": "bob@cyberlab.local",
        "role": "student"
    },
    {
        "username": "charlie_dev",
        "password": "CharlieDev2026!",
        "email": "charlie@cyberlab.local",
        "role": "researcher"
    },
    {
        "username": "prof_davis",
        "password": "ProfDavis2026!",
        "email": "prof.davis@cyberlab.local",
        "role": "faculty"
    }
]


def seed_database():
    """
    Creates database schema tables and seeds initial test users if none exist.
    """
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if users already exist
        existing_count = db.query(User).count()
        if existing_count == 0:
            print("[SEED] Seeding database with dummy fictional test accounts...")
            for user_data in SEED_USERS:
                user = User(**user_data)
                db.add(user)
            db.commit()
            print(f"[SEED] Successfully seeded {len(SEED_USERS)} test users.")
        else:
            print(f"[SEED] Database already contains {existing_count} user records.")
    except Exception as e:
        db.rollback()
        print(f"[SEED ERROR] Failed to seed database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
