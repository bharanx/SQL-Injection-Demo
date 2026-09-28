import React, { useState, useEffect } from 'react';
import { getStudentMarks, searchStudentMarks } from '../../services/student';

const Results = () => {
  const [searchRegNo, setSearchRegNo] = useState('');
  const [searchMarks, setSearchMarks] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <div>
      <h1 className="page-title">Academic Results</h1>
      
      <div className="card">
        <h3 style={{ color: 'var(--primary)', marginBottom: '16px' }}>Past Records Lookup</h3>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!searchRegNo.trim()) return;
          setSearchLoading(true);
          setSearchError('');
          setHasSearched(true);
          try {
            const data = await searchStudentMarks(searchRegNo);
            setSearchMarks(data);
          } catch (err) {
            setSearchError('Student not found or error occurred.');
            setSearchMarks([]);
          } finally {
            setSearchLoading(false);
          }
        }} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: '400px' }}>
            <label className="form-label">Register Number:</label>
            <input 
              type="text" 
              className="form-control" 
              value={searchRegNo}
              onChange={(e) => setSearchRegNo(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', height: '38px' }}>Search</button>
        </form>

        {searchError && <div className="error-message" style={{ marginBottom: '16px' }}>{searchError}</div>}
        
        {searchLoading ? (
          <p>Searching...</p>
        ) : hasSearched && searchMarks.length === 0 && !searchError ? (
          <p>No records found.</p>
        ) : searchMarks.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Register Number</th>
                <th>Student Name</th>
                <th>Subject</th>
                <th>Total (100)</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {searchMarks.map((m) => (
                <tr key={`search-${m.id}`}>
                  <td style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{m.register_number || searchRegNo.split("'")[0]}</td>
                  <td>{m.student_name || 'Unknown'}</td>
                  <td>{m.subject_name}</td>
                  <td><strong>{m.total}</strong></td>
                  <td>{m.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
};

export default Results;
