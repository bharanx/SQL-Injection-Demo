import React, { useState, useEffect } from 'react';
import { getTeacherSubjects } from '../../services/teacher';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getTeacherSubjects();
        setSubjects(data);
      } catch (err) {
        setError('Failed to load subjects.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div>
      <h1 className="page-title">Assigned Subjects</h1>
      
      <div className="card">
        <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Department Subjects
        </h3>
        {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

        {loading ? (
          <p>Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p>No subjects found for your department.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.code}</strong></td>
                  <td>{s.name}</td>
                  <td>{s.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Subjects;
