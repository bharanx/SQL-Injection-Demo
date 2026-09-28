import React, { useState, useEffect } from 'react';
import { getStudents, getTeacherSubjects, recordAttendance } from '../../services/teacher';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    semester: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studs, subs] = await Promise.all([getStudents(), getTeacherSubjects()]);
        setStudents(studs);
        setSubjects(subs);
      } catch (err) {
        setError('Failed to load initial data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await recordAttendance({
        student_id: parseInt(formData.student_id),
        subject_id: parseInt(formData.subject_id),
        date: formData.date,
        status: formData.status,
        semester: parseInt(formData.semester)
      });
      setSuccess('Attendance successfully recorded.');
      // Keep everything selected so the teacher can quickly select the next student
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit attendance.');
    }
  };

  return (
    <div>
      <h1 className="page-title">Attendance Management</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Record Daily Attendance
        </h3>
        
        {loading ? <p>Loading prerequisites...</p> : (
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}
            {success && <div style={{ color: 'var(--success)', marginBottom: '16px', fontWeight: 'bold' }}>{success}</div>}

            <div className="form-group">
              <label className="form-label">Select Student</label>
              <select name="student_id" className="form-control" value={formData.student_id} onChange={handleFormChange} required>
                <option value="">-- Choose Student --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.register_number} - {s.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Subject</label>
              <select name="subject_id" className="form-control" value={formData.subject_id} onChange={handleFormChange} required>
                <option value="">-- Choose Subject --</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" name="date" className="form-control" value={formData.date} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Semester</label>
                <input type="number" name="semester" className="form-control" value={formData.semester} onChange={handleFormChange} required />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">Status</label>
              <div style={{ display: 'flex', gap: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="status" value="Present" checked={formData.status === 'Present'} onChange={handleFormChange} />
                  Present
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="status" value="Absent" checked={formData.status === 'Absent'} onChange={handleFormChange} />
                  Absent
                </label>
              </div>
            </div>

            <button type="submit" className="btn" style={{ marginTop: '16px' }}>Record Attendance</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Attendance;
