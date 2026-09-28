import React, { useState, useEffect } from 'react';
import { getStudentAttendance } from '../../services/student';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semesterFilter, setSemesterFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance(semesterFilter);
  }, [semesterFilter]);

  const fetchAttendance = async (sem) => {
    setLoading(true);
    setError('');
    try {
      const data = await getStudentAttendance(sem || null);
      setAttendance(data);
    } catch (err) {
      setError('Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setSemesterFilter(e.target.value);
  };

  // Group by subject to calculate percentages
  const subjectStats = attendance.reduce((acc, curr) => {
    if (!acc[curr.subject_code]) {
      acc[curr.subject_code] = {
        name: curr.subject_name,
        code: curr.subject_code,
        semester: curr.semester,
        total: 0,
        present: 0,
        absent: 0
      };
    }
    acc[curr.subject_code].total += 1;
    if (curr.status === 'Present') {
      acc[curr.subject_code].present += 1;
    } else {
      acc[curr.subject_code].absent += 1;
    }
    return acc;
  }, {});

  const statsArray = Object.values(subjectStats);

  return (
    <div>
      <h1 className="page-title">Attendance Log</h1>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--primary)' }}>Subject-wise Attendance</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Filter by Semester:</label>
            <select className="form-control" style={{ width: '150px' }} value={semesterFilter} onChange={handleFilterChange}>
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

        {loading ? (
          <p>Loading attendance...</p>
        ) : statsArray.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Sem</th>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Conducted</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {statsArray.map((s, idx) => {
                const percentage = ((s.present / s.total) * 100).toFixed(1);
                let badgeClass = "badge-success";
                let statusText = "Good";
                if (percentage < 75) {
                  badgeClass = "badge-danger";
                  statusText = "Low";
                } else if (percentage < 85) {
                  badgeClass = "badge-warning";
                  statusText = "Warning";
                }
                
                return (
                  <tr key={idx}>
                    <td>{s.semester}</td>
                    <td><strong>{s.code}</strong></td>
                    <td>{s.name}</td>
                    <td>{s.total}</td>
                    <td>{s.present}</td>
                    <td>{s.absent}</td>
                    <td><strong>{percentage}%</strong></td>
                    <td><span className={`badge ${badgeClass}`}>{statusText}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
