import React, { useState, useEffect } from 'react';
import { getStudentNotices, getNoticeById } from '../../services/student';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchedNotices, setSearchedNotices] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await getStudentNotices();
      setNotices(data);
      setSearchedNotices(null);
      setError('');
    } catch (err) {
      setError('Failed to load notices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      fetchNotices();
      return;
    }
    
    setLoading(true);
    try {
      const data = await getNoticeById(searchId);
      setSearchedNotices(data);
      setError('');
    } catch (err) {
      setError('Notice not found or error occurred.');
      setSearchedNotices(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Institutional Notices</h1>
      
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Lookup Specific Notice</h3>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input 
            type="text" 
            placeholder="Enter Notice ID (e.g. 1)" 
            className="form-control" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Lookup</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setSearchId(''); fetchNotices(); }}>Clear</button>
        </form>
      </div>
      
      {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}
      
      {loading ? (
        <p>Loading notices...</p>
      ) : searchedNotices && searchedNotices.length > 0 ? (
        searchedNotices.map(n => (
          <div key={n.id} className="card" style={{ marginBottom: '16px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '4px' }}>{n.title || 'Unknown Title'}</h3>
                <span className="badge badge-primary">{n.category || 'N/A'}</span>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div><strong>ID:</strong> {n.id}</div>
                <div><strong>Published:</strong> {n.publish_date || 'N/A'}</div>
                <div><strong>Expires:</strong> {n.expiry_date || 'N/A'}</div>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
              {n.content || 'No content available'}
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Issued by: <strong>{n.author_name || 'Unknown'}</strong> | Audience: <strong>{n.target_audience || 'N/A'}</strong>
            </div>
          </div>
        ))
      ) : notices.length === 0 ? (
        <div className="card">
          <p>No active notices available.</p>
        </div>
      ) : (
        notices.map(n => (
          <div key={n.id} className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '4px' }}>{n.title}</h3>
                <span className="badge badge-primary">{n.category}</span>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div><strong>ID:</strong> {n.id}</div>
                <div><strong>Published:</strong> {n.publish_date}</div>
                <div><strong>Expires:</strong> {n.expiry_date}</div>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
              {n.content}
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Issued by: <strong>{n.author_name}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notices;
