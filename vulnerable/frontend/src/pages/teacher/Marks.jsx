import React, { useState, useEffect } from 'react';
import { getStudents, getTeacherSubjects, enterMarks } from '../../services/teacher';

const Marks = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    internal: '',
    external: '',
    academic_year: '2023-2024',
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

  const internalVal = parseFloat(formData.internal) || 0;
  const externalVal = parseFloat(formData.external) || 0;
  const total = internalVal + externalVal;
  
  let grade = "U";
  if (total >= 90) grade = "O";
  else if (total >= 80) grade = "A+";
  else if (total >= 70) grade = "A";
  else if (total >= 60) grade = "B+";
  else if (total >= 50) grade = "B";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (internalVal < 0 || internalVal > 40) {
      setError('Internal marks must be between 0 and 40.');
      return;
    }
    if (externalVal < 0 || externalVal > 60) {
      setError('External marks must be between 0 and 60.');
      return;
    }

    try {
      await enterMarks({
        student_id: parseInt(formData.student_id),
        subject_id: parseInt(formData.subject_id),
        internal: internalVal,
        external: externalVal,
        academic_year: formData.academic_year,
        semester: parseInt(formData.semester)
      });
      setSuccess('Marks successfully recorded.');
      setFormData({ ...formData, internal: '', external: '' }); // reset marks but keep selection
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit marks.');
    }
  };

  return (
    <div>
      <h1 className="page-title">Marks Management</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Enter Student Marks
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
                <label className="form-label">Semester</label>
                <input type="number" name="semester" className="form-control" value={formData.semester} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input type="text" name="academic_year" className="form-control" value={formData.academic_year} onChange={handleFormChange} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
              <div className="form-group">
                <label className="form-label">Internal Marks (Max 40)</label>
                <input type="number" step="0.1" name="internal" className="form-control" value={formData.internal} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">External Marks (Max 60)</label>
                <input type="number" step="0.1" name="external" className="form-control" value={formData.external} onChange={handleFormChange} required />
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#F8F9FA', border: '1px solid var(--border-color)', borderRadius: '4px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total: {total.toFixed(1)} / 100</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Grade: <span className="badge badge-primary" style={{ fontSize: '1rem' }}>{grade}</span></span>
              </div>
            </div>

            <button type="submit" className="btn">Submit Marks</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Marks;
