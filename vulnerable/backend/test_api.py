import requests

BASE_URL = "http://localhost:8000/api"

print("--- 1. Login as Student ---")
r = requests.post(f"{BASE_URL}/login", data={"username": "REG2023100", "password": "student123"})
s_token = r.json().get("access_token")
s_headers = {"Authorization": f"Bearer {s_token}"}
print("Student Token:", s_token[:20] + "...")

print("\n--- 2. Student Profile ---")
r = requests.get(f"{BASE_URL}/student/profile", headers=s_headers)
student_id = r.json().get('id')
print("Profile:", r.status_code, r.json().get('name'))

print("\n--- 3. Student Updates Own Phone ---")
r = requests.put(f"{BASE_URL}/student/profile", json={"phone": "9999999999"}, headers=s_headers)
print("Update Phone:", r.status_code, r.json().get('phone'))

print("\n--- 4. Student Attempts Teacher Endpoint (Expected 403) ---")
r = requests.get(f"{BASE_URL}/teacher/students", headers=s_headers)
print("Teacher Endpoint:", r.status_code, r.json())

print("\n--- 5. Login as Teacher ---")
r = requests.post(f"{BASE_URL}/login", data={"username": "EMP001", "password": "teacher123"})
t_token = r.json().get("access_token")
t_headers = {"Authorization": f"Bearer {t_token}"}
print("Teacher Token:", t_token[:20] + "...")

print("\n--- 6. Teacher Lists Students ---")
r = requests.get(f"{BASE_URL}/teacher/students", headers=t_headers)
students = r.json()
print("Total Students:", len(students))

print("\n--- 7. Teacher Updates Marks ---")
# Using the first subject (CS101 -> ID 1)
mark_data = {
    "student_id": student_id,
    "subject_id": 1,
    "internal": 38,
    "external": 55,
    "academic_year": "2023-2024",
    "semester": 3
}
r = requests.post(f"{BASE_URL}/teacher/marks", json=mark_data, headers=t_headers)
print("Marks Update:", r.status_code, r.json())

print("\n--- 8. Teacher Updates Invalid Marks (Expected 422) ---")
invalid_mark_data = mark_data.copy()
invalid_mark_data["internal"] = 50 # Max is 40
r = requests.post(f"{BASE_URL}/teacher/marks", json=invalid_mark_data, headers=t_headers)
print("Invalid Marks Update:", r.status_code, r.json())

print("\n--- 9. Teacher Records Attendance ---")
att_data = {
    "student_id": student_id,
    "subject_id": 1,
    "date": "2023-10-01",
    "status": "Present",
    "semester": 3
}
r = requests.post(f"{BASE_URL}/teacher/attendance", json=att_data, headers=t_headers)
print("Attendance Update:", r.status_code, r.json())

print("\n--- 10. Teacher Creates Notice ---")
notice_data = {
    "title": "Extra Class",
    "category": "Academic",
    "content": "There will be an extra class.",
    "target_audience": "students",
    "publish_date": "2023-10-01",
    "expiry_date": "2030-10-01"
}
r = requests.post(f"{BASE_URL}/teacher/notices", json=notice_data, headers=t_headers)
print("Notice Create:", r.status_code, r.json())

print("\n--- 11. Student Views Marks ---")
r = requests.get(f"{BASE_URL}/student/marks", headers=s_headers)
print("Student Marks:", r.status_code, r.json())

print("\n--- 12. Student Views Attendance ---")
r = requests.get(f"{BASE_URL}/student/attendance", headers=s_headers)
print("Student Attendance:", r.status_code, r.json())

print("\n--- 13. Student Views Notices ---")
r = requests.get(f"{BASE_URL}/student/notices", headers=s_headers)
print("Student Notices:", r.status_code, [n['title'] for n in r.json()])
