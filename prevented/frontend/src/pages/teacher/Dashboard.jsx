import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getTeacherProfile, getTeacherSubjects, getStudents } from '../../services/teacher';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    subjectCount: 0,
    studentCount: 0,
    profile: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [fullProfile, subjects, students] = await Promise.all([
          getTeacherProfile(),
          getTeacherSubjects(),
          getStudents()
        ]);
        
        setStats({
          subjectCount: subjects.length,
          studentCount: students.length,
          profile: fullProfile
        });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.profile) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user || !user.profile) return null;
  const p = stats.profile || user.profile;

  return (
    <div>
      <h1 className="page-title">Teacher Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Faculty Profile
          </h3>
          {loading ? <p>Loading profile...</p> : (
            <>
              <p><strong>Name:</strong> {p.name}</p>
              <p><strong>Employee ID:</strong> {p.employee_id}</p>
              <p><strong>Department:</strong> {p.department?.name || p.department_id} {p.department?.code ? `(${p.department.code})` : ''}</p>
              <p><strong>Designation:</strong> {p.designation}</p>
            </>
          )}
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Academic Overview
          </h3>
          {loading ? <p>Loading data...</p> : (
            <>
              <p><strong>Total Students in Dept:</strong> {stats.studentCount}</p>
              <p><strong>Assigned Subjects:</strong> {stats.subjectCount}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
