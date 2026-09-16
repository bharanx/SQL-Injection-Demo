import React, { useState, useEffect } from 'react';
import { Database, Shield, RefreshCw } from 'lucide-react';
import { fetchDatabaseUsers } from '../services/api';

export default function DatabaseViewer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchDatabaseUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Database size={32} style={{ color: '#a855f7' }} />
          Database Explorer — SQLite Viewer
        </h1>
        <p className="page-subtitle">
          Read-only training database inspector for fictional test accounts stored in SQLite (sql_lab.db).
        </p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Table: <code>users</code></h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Read-only training database</div>
          </div>
          <button className="btn btn-secondary" onClick={loadData} disabled={loading}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading database records...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Password Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, color: '#06b6d4' }}>{u.id}</td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{u.username}</td>
                    <td>{u.email}</td>
                    <td><span className="badge badge-cyan">{u.role}</span></td>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>[ Protected / Not Returned ]</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
