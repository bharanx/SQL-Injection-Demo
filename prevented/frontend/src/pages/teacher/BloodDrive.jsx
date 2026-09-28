import React, { useState } from 'react';
import { checkBloodDriveStatus } from '../../services/teacher';

const BloodDrive = () => {
  const [registerNumber, setRegisterNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!registerNumber.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const data = await checkBloodDriveStatus(registerNumber);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to check blood drive status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Blood Drive Management</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '16px' }}>Check Student Blood Drive Eligibility</h3>
        
        <form onSubmit={handleCheck} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Student Register Number</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. REG2023100" 
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', height: '38px' }} disabled={loading}>
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </form>

        {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

        {result && (
          <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #ddd' }}>
            <h4 style={{ marginBottom: '12px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>Eligibility Result</h4>
            <p style={{ marginBottom: '8px' }}><strong>Student Name:</strong> {result.student}</p>
            <p style={{ marginBottom: '8px' }}><strong>Blood Group:</strong> {result.blood_group}</p>
            <p style={{ marginBottom: '8px' }}><strong>Available Units:</strong> {result.count}</p>
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: result.inventory_status === 'Needed' ? '#fff3cd' : '#d1e7dd', 
              color: result.inventory_status === 'Needed' ? '#856404' : '#0f5132',
              borderRadius: '4px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              Inventory Status: {result.inventory_status}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodDrive;
