import React, { useState, useEffect } from 'react';
import { getStudentSubjects, checkEligibility, reportIssue } from '../../services/student';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [eligibilityCode, setEligibilityCode] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);
  
  const [issueForm, setIssueForm] = useState({ title: '', description: '' });
  const [issueStatus, setIssueStatus] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getStudentSubjects();
        setSubjects(data);
      } catch (err) {
        setError('Failed to load subjects.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    if (!eligibilityCode.trim()) return;
    setLoading(true);
    try {
      const result = await checkEligibility(eligibilityCode);
      setEligibilityResult(result);
    } catch (err) {
      setEligibilityResult({ eligible: false, error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();
    if (!issueForm.title.trim() || !issueForm.description.trim()) return;
    setLoading(true);
    try {
      await reportIssue(issueForm);
      setIssueStatus('Issue reported successfully.');
      setIssueForm({ title: '', description: '' });
      setTimeout(() => setIssueStatus(''), 3000);
    } catch (err) {
      setIssueStatus('Failed to report issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Enrolled Subjects</h1>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Check Subject Eligibility (Time-Based / OOB SQLi Target)</h3>
        <form onSubmit={handleCheckEligibility} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input 
            type="text" 
            placeholder="Enter Subject Code (e.g. CS101)" 
            className="form-control" 
            value={eligibilityCode}
            onChange={(e) => setEligibilityCode(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Check Eligibility</button>
        </form>
        {eligibilityResult && !eligibilityResult.error && (
          <div style={{ marginTop: '10px', padding: '10px', borderRadius: '4px', backgroundColor: eligibilityResult.eligible ? '#d4edda' : '#f8d7da', color: eligibilityResult.eligible ? '#155724' : '#721c24' }}>
            <strong>Result: </strong> {eligibilityResult.eligible ? `Eligible for ${eligibilityResult.subject || 'Subject'}` : 'Not Eligible or Not Found'}
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Report Subject Issue (OOB Alternative Target)</h3>
        {issueStatus && <div style={{ marginBottom: '10px', color: issueStatus.includes('Failed') ? 'var(--danger)' : 'var(--success)' }}>{issueStatus}</div>}
        <form onSubmit={handleReportIssue} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          <input 
            type="text" 
            placeholder="Issue Title" 
            className="form-control" 
            value={issueForm.title}
            onChange={(e) => setIssueForm({...issueForm, title: e.target.value})}
          />
          <textarea 
            placeholder="Describe the issue with the subject..." 
            className="form-control" 
            rows="3"
            value={issueForm.description}
            onChange={(e) => setIssueForm({...issueForm, description: e.target.value})}
          ></textarea>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Submit Issue</button>
        </form>
      </div>
      
      
      <div className="card">
        <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Current Semester Subjects
        </h3>
        {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

        {loading ? (
          <p>Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p>No subjects found for your current semester.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Department</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.code}</strong></td>
                  <td>{s.name}</td>
                  <td>{s.department_id}</td>
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
