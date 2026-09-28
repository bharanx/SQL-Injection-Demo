import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getStudentAttendance, getStudentSubjects, getStudentNotices, getStudentProfile } from '../../services/student';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    subjectCount: 0,
    notices: [],
    profile: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [attendance, subjects, notices, fullProfile] = await Promise.all([
          getStudentAttendance(user.profile.semester),
          getStudentSubjects(),
          getStudentNotices(),
          getStudentProfile()
        ]);
        
        const totalClasses = attendance.length;
        const presentClasses = attendance.filter(a => a.status === 'Present').length;
        const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 'N/A';

        setStats({
          attendancePercentage: percentage,
          subjectCount: subjects.length,
          notices: notices.slice(0, 3), // Top 3 recent
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
      <h1 className="page-title">Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Academic Profile
          </h3>
          {loading ? <p>Loading profile...</p> : (
            <>
              <p><strong>Name:</strong> {p.name}</p>
              <p><strong>Register Number:</strong> {p.register_number}</p>
              <p><strong>Department:</strong> {p.department?.name || p.department_id} {p.department?.code ? `(${p.department.code})` : ''}</p>
              <p><strong>Year:</strong> {p.year} | <strong>Semester:</strong> {p.semester}</p>
              <p><strong>Academic Year:</strong> 2023-2024</p>
            </>
          )}
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Current Semester Overview
          </h3>
          {loading ? <p>Loading data...</p> : (
            <>
              <p><strong>Total Subjects:</strong> {stats.subjectCount}</p>
              <p><strong>Overall Attendance:</strong> {stats.attendancePercentage}%</p>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Recent Notices
        </h3>
        {loading ? <p>Loading notices...</p> : stats.notices.length === 0 ? <p>No recent notices.</p> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {stats.notices.map(n => (
                <tr key={n.id}>
                  <td style={{width: '120px'}}>{n.publish_date}</td>
                  <td style={{width: '120px'}}><span className="badge badge-primary">{n.category}</span></td>
                  <td><strong>{n.title}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
