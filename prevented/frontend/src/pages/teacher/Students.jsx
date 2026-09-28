import React, { useState, useEffect } from 'react';
import { getStudents, updateStudent, getStudent, verifyStudent } from '../../services/teacher';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', year: '' });
  const [error, setError] = useState('');
  
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ email: '', phone: '', address: '', year: '', semester: '' });
  const [updateStatus, setUpdateStatus] = useState('');
  
  const [lookupId, setLookupId] = useState('');
  
  const [verifyReg, setVerifyReg] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getStudents(filters);
      setStudents(data);
    } catch (err) {
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
      year: student.year || '',
      semester: student.semester || ''
    });
    setUpdateStatus('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setLoading(true);
    try {
      const student = await getStudent(lookupId);
      openEdit(student);
      setError('');
    } catch (err) {
      setError('Lookup failed. Student not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verifyReg.trim()) return;
    setLoading(true);
    try {
      const data = await verifyStudent(verifyReg);
      setVerifyResult(data.verified);
      setError('');
    } catch (err) {
      setError('Verification request failed.');
      setVerifyResult(null);
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setUpdateStatus('Updating...');
    try {
      const data = await updateStudent(editingStudent.id, {
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        year: parseInt(editForm.year) || undefined,
        semester: parseInt(editForm.semester) || undefined
      });
      // Update local state
      setStudents(students.map(s => s.id === data.id ? data : s));
      setUpdateStatus('Update successful.');
      setTimeout(() => setEditingStudent(null), 1500);
    } catch (err) {
      setUpdateStatus('Update failed. Check inputs.');
    }
  };

  return (
    <div>
      <h1 className="page-title">Student Management</h1>
      
      <div style={{ padding: '12px', backgroundColor: '#e2f0d9', color: '#2e7d32', borderRadius: '4px', marginBottom: '20px', border: '1px solid #c3e6cb' }}>
        <strong>Authorized Scope:</strong> Showing students within your assigned department only.
      </div>

      <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <label className="form-label">Search (Name or Reg No)</label>
          <input type="text" name="q" className="form-control" value={filters.q} onChange={handleFilterChange} placeholder="Search students..." />
        </div>
        <div style={{ width: '150px' }}>
          <label className="form-label">Filter by Year</label>
          <select name="year" className="form-control" value={filters.year} onChange={handleFilterChange}>
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Direct Profile Lookup (ByID)</h3>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input 
            type="text" 
            placeholder="Enter Student ID (e.g. 1)" 
            className="form-control" 
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Lookup Profile</button>
        </form>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Student Verification (By Registration Number)</h3>
        <form onSubmit={handleVerify} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input 
            type="text" 
            placeholder="Enter Registration No (e.g. REG2023100)" 
            className="form-control" 
            value={verifyReg}
            onChange={(e) => setVerifyReg(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Verify Student</button>
        </form>
        {verifyResult !== null && (
          <div style={{ marginTop: '10px', padding: '10px', borderRadius: '4px', backgroundColor: verifyResult ? '#d4edda' : '#f8d7da', color: verifyResult ? '#155724' : '#721c24' }}>
            <strong>Status: </strong> {verifyResult ? 'Verified (Student Exists)' : 'Not Verified (Not Found)'}
          </div>
        )}
      </div>

      {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <div className="card"><p>No students found matching your search.</p></div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reg. Number</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.register_number}</strong></td>
                  <td>{s.name}</td>
                  <td><span className="badge badge-primary">{s.department?.code}</span></td>
                  <td>{s.year}</td>
                  <td>{s.semester}</td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.85rem' }} onClick={() => openEdit(s)}>
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Basic Modal for Editing */}
      {editingStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', margin: '20px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Edit Student: {editingStudent.name}
            </h3>
            {updateStatus && <div style={{ marginBottom: '16px', color: updateStatus.includes('failed') ? 'var(--danger)' : 'var(--success)' }}>{updateStatus}</div>}
            
            <form onSubmit={submitEdit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={editForm.email} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="text" name="phone" className="form-control" value={editForm.phone} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea name="address" className="form-control" value={editForm.address} onChange={handleEditChange} rows="2" required></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input type="number" name="year" className="form-control" value={editForm.year} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input type="number" name="semester" className="form-control" value={editForm.semester} onChange={handleEditChange} required />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setEditingStudent(null)}>Cancel</button>
                <button type="submit" className="btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
