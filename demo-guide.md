# Live Faculty Demonstration & Presentation Guide

**Project Title:** SQL Injection Prevention using Parameterized Queries, ORM Frameworks, and Input Validation  
**Duration:** 5 – 10 Minutes  
**Audience:** Faculty Evaluator & Peer Students  

---

## 1. Step-by-Step Demonstration Sequence

### STEP 1: Start Backend Server
Open terminal 1 in `d:\SQL Injection\backend`:
```cmd
cd "d:\SQL Injection\backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
*Verify console output shows `Application startup complete` on http://127.0.0.1:8000.*

---

### STEP 2: Start Frontend Application
Open terminal 2 in `d:\SQL Injection\frontend`:
```cmd
cd "d:\SQL Injection\frontend"
npm install
npm run dev
```
*Open browser to http://localhost:5173.*

---

### STEP 3: Open Dashboard Overview
- Highlight top security banner: `"Educational Lab Environment — Local Testing Only"`.
- Present the 4 technique status cards:
  1. Vulnerable SQL (Unsafe ❌)
  2. Parameterized Query (Protected ✅)
  3. SQLAlchemy ORM (Protected ✅)
  4. Input Validation (Defense in Depth 🛡️)

---

### STEP 4: Explain SQL Injection Vulnerability Mechanics
- Navigate to **SQL Injection Demo** tab.
- Explain how direct string concatenation allows untrusted input characters to break string literal boundaries and alter the database SQL Abstract Syntax Tree (AST).

---

### STEP 5: Demonstrate Vulnerable Query Bypass
- Click preset **`SQLi Comment Bypass (admin' --)`**.
- Click **`[ Test Vulnerable ]`**.
- **Demonstrate Result:**
  - Show status badge `UNSAFE ❌`.
  - Point out executed query: `SELECT * FROM users WHERE username = 'admin' --' AND password = '...'`.
  - Explain how `--` commented out the password verification check, granting instant access to the `admin` account without knowing the password!

---

### STEP 6: Demonstrate Parameterized Query Defense
- Keep identical input **`admin' --`** in username box.
- Click **`[ Test Parameterized ]`**.
- **Demonstrate Result:**
  - Show status badge `PROTECTED ✅`.
  - Point out executed query template: `SELECT * FROM users WHERE username = ? AND password = ?`.
  - Explain bound parameters `["admin' --", "********"]`.
  - Emphasize that SQLite treated `admin' --` strictly as a literal data string, returning 0 records and neutralizing the attack.

---

### STEP 7: Demonstrate SQLAlchemy ORM Defense
- Keep input **`' OR '1'='1`** or **`admin' --`**.
- Click **`[ Test SQLAlchemy ORM ]`**.
- **Demonstrate Result:**
  - Show status badge `PROTECTED ✅`.
  - Explain how SQLAlchemy ORM method `.filter(User.username == username)` automatically generated parameterized SQL query placeholders under the hood.

---

### STEP 8: Demonstrate Input Validation Perimeter Defense
- Switch to **Input Validation** tab.
- Click preset **`INVALID: admin' --`**.
- Click **`Run Validation Check`**.
- **Demonstrate Result:**
  - Show perimeter rejection `❌ INVALID INPUT`.
  - Explain that input validation blocked malformed characters BEFORE any database connection or query was made.

---

### STEP 9: Show Comparison Matrix Tab
- Switch to **Comparison Matrix** tab.
- Review the side-by-side table comparing technique mechanics, security roles, and statuses.

---

### STEP 10: Conclude & Answer Faculty Questions
- Reiterate key takeaway: Parameterized queries and ORM abstractions are the primary database defense, while input validation provides perimeter defense in depth.

---

## 2. Team Member Presentation Roles & Speaking Notes

### TEAM MEMBER 1: Introduction + SQL Injection Mechanics (60 Seconds)

> *"Good morning Professor. Today our team is presenting our cybersecurity lab project on SQL Injection Prevention using Parameterized Queries, ORM Frameworks, and Input Validation.*
>
> *SQL Injection is an OWASP Top 10 vulnerability where attackers inject malicious SQL code through user inputs. When an application concatenates raw strings into SQL queries, the database engine cannot distinguish developer code from user input.*
>
> *As demonstrated on our dashboard, submitting payload `admin' --` to our vulnerable endpoint turns the single quote and double dash into SQL control characters, commenting out the password check and granting unauthorized admin access. I will now hand over to Team Member 2 to explain how parameterized queries eliminate this threat."*

---

### TEAM MEMBER 2: Parameterized Queries / Prepared Statements (60 Seconds)

> *"Thank you. To solve SQL Injection, the primary defense is Parameterized Queries, also known as Prepared Statements.*
>
> *Instead of gluing user strings into the SQL command, parameterized queries separate the query compilation from data binding. As shown in our code comparison, the SQL template is pre-compiled first using placeholders like `?` in SQLite.*
>
> *When we submit the exact same payload `admin' --` to our secure parameterized endpoint, the database engine treats `admin' --` strictly as a plain data string value. It looks for a user whose literal name is `admin' --`. Since no such user exists, 0 records are returned, making the attack completely harmless."*

---

### TEAM MEMBER 3: SQLAlchemy ORM Framework (60 Seconds)

> *"Moving on to our second secure approach, Object-Relational Mapping, or ORM frameworks like SQLAlchemy.*
>
> *ORMs allow developers to write clean Python object queries, such as `db.query(User).filter(User.username == username)`, instead of manually writing raw SQL strings.*
>
> *Under the hood, SQLAlchemy's Expression Language automatically converts object filters into safe parameterized SQL statements with parameter placeholders. This eliminates manual string concatenation for developers by default. However, as noted in our comparison matrix, developers must be careful not to manually concatenate strings inside raw ORM helpers."*

---

### TEAM MEMBER 4: Input Validation & Conclusion (60 Seconds)

> *"Finally, we implemented Input Validation using Pydantic schemas as an additional layer of Defense in Depth.*
>
> *Our input validation rules enforce a 3-to-30 character length limit and restrict usernames to alphanumeric characters and underscores. As shown in our validation demo, submitting single quotes or SQL comments gets rejected at the application perimeter before any database query is executed.*
>
> *To conclude: Input validation stops bad data at the perimeter, but Parameterized Queries and ORMs remain the mandatory primary defense because legitimate data can contain special characters. Thank you Professor, we welcome any questions!"*
