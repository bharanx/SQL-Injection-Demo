from sqlalchemy import create_engine, text, select
from sqlalchemy.orm import Session
from models import Student

engine = create_engine('sqlite:///:memory:')
db = Session(engine)
q = "a%' OR 1=1 --"

query_text = f"name LIKE '%{q}%' OR register_number LIKE '%{q}%'"
print("Inner Text:", query_text)

try:
    query = db.query(Student).filter(Student.department_id == 1).filter(text(query_text))
    print("Compiled SQL:", str(query.statement.compile(compile_kwargs={'literal_binds': True})))
    db.execute(query.statement)
except Exception as e:
    print("Error:", e)
