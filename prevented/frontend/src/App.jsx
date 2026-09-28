import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentResults from './pages/student/Results';
import StudentAttendance from './pages/student/Attendance';
import StudentSubjects from './pages/student/Subjects';
import StudentNotices from './pages/student/Notices';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherStudents from './pages/teacher/Students';
import TeacherMarks from './pages/teacher/Marks';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherSubjects from './pages/teacher/Subjects';
import TeacherNotices from './pages/teacher/Notices';
import TeacherBloodDrive from './pages/teacher/BloodDrive';
import TeacherProfile from './pages/teacher/Profile';


// Placeholder generic page for routing check
const Placeholder = ({ title }) => (
  <div>
    <h1 className="page-title">{title}</h1>
    <div className="card">Content coming soon in Phase 5...</div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="subjects" element={<StudentSubjects />} />
            <Route path="notices" element={<StudentNotices />} />

            <Route path="" element={<Navigate to="/student/dashboard" replace />} />
          </Route>

          <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="marks" element={<TeacherMarks />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="subjects" element={<TeacherSubjects />} />
            <Route path="notices" element={<TeacherNotices />} />
            <Route path="blood-drive" element={<TeacherBloodDrive />} />
            <Route path="profile" element={<TeacherProfile />} />

            <Route path="" element={<Navigate to="/teacher/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
