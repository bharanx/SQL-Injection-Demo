import React, { useState } from 'react';
import { Search, AlertOctagon, ShieldCheck, Database, UserCheck, Terminal } from 'lucide-react';
import { searchUsersVulnerable, searchUsersParameterized, searchUsersOrm } from '../services/api';
import VisualFlow from '../components/VisualFlow.jsx';
import LearningPanel from '../components/LearningPanel.jsx';

export default function SearchLab({ onScenarioComplete }) {
  const [mode, setMode] = useState('vulnerable');
  const [searchTerm, setSearchTerm] = useState("' OR '1'='1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    { label: "Normal Search (alice)", term: "alice" },
    { label: "Normal Role Search (student)", term: "student" },
    { label: "SQLi Search Bypass (' OR '1'='1)", term: "' OR '1'='1" },
    { label: "SQLi Comment Search (admin' --)", term: "admin' --" },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let res;
      if (mode === 'vulnerable') {
        res = await searchUsersVulnerable(searchTerm);
      } else if (mode === 'parameterized') {
        res = await searchUsersParameterized(searchTerm);
      } else {
        res = await searchUsersOrm(searchTerm);
      }
      if (res.success) onScenarioComplete(4);
      setResult(res);
    } catch (err) {
      setResult({
        technique: mode,
        security: 'error',
        security_badge: 'ERROR ❌',
        success: false,
        message: `Error: ${err.message}`,
        query_executed: 'Search failed',
        rows_matched: 0,
        users: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Search size={32} style={{ color: '#06b6d4' }} />
          Employee Directory — Search Security Lab
        </h1>
        <p className="page-subtitle">
          Demonstrates that SQL Injection isn't only a login problem — search filters can also be manipulated.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>SELECT SEARCH QUERY IMPLEMENTATION:</span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${mode === 'vulnerable' ? 'btn-vulnerable' : 'btn-secondary'}`}
            onClick={() => { setMode('vulnerable'); setResult(null); }}
          >
            <AlertOctagon size={16} /> [ VULNERABLE SEARCH ]
          </button>
          <button
            className={`btn ${mode === 'parameterized' ? 'btn-secure' : 'btn-secondary'}`}
            onClick={() => { setMode('parameterized'); setResult(null); }}
          >
            <ShieldCheck size={16} /> [ PARAMETERIZED SEARCH ]
          </button>
          <button
            className={`btn ${mode === 'orm' ? 'btn-secure' : 'btn-secondary'}`}
            style={mode === 'orm' ? { backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9', borderColor: 'rgba(6, 182, 212, 0.5)' } : {}}
            onClick={() => { setMode('orm'); setResult(null); }}
          >
            <ShieldCheck size={16} /> [ ORM SEARCH ]
          </button>
        </div>
      </div>

      {/* Search Input Area */}
      <div className="card">
        <h3 className="card-title">Employee Directory Search</h3>
        
        <div className="preset-pills">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Test Search Presets:</span>
          {presets.map((p, i) => (
            <button key={i} className="preset-pill" onClick={() => setSearchTerm(p.term)}>
              {p.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
          <input
            type="text"
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee name or role (e.g. alice or ' OR '1'='1)"
            style={{ flex: 1 }}
          />
          <button type="submit" className={`btn ${mode === 'vulnerable' ? 'btn-vulnerable' : 'btn-secure'}`} disabled={loading}>
            <Search size={18} /> {loading ? 'Searching...' : 'SEARCH'}
          </button>
        </form>
      </div>

      {/* Results Table & Query Trace */}
      {result && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Search Results ({result.rows_matched} record(s) returned)
            </h3>
            <span className={`badge ${result.security === 'unsafe' ? 'badge-vulnerable' : 'badge-secure'}`}>
              {result.security_badge}
            </span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>
              EXECUTED QUERY:
            </div>
            <pre className="code-block" style={{ fontSize: '0.82rem' }}>
              <code>{result.query_executed}</code>
            </pre>
          </div>

          {result.users && result.users.length > 0 ? (
            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {result.users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 700, color: '#06b6d4' }}>{u.id}</td>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{u.username}</td>
                      <td>{u.email}</td>
                      <td><span className="badge badge-cyan">{u.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', background: '#090d16', borderRadius: '8px', marginBottom: '1rem' }}>
              No employees matched the search filter.
            </div>
          )}

          <VisualFlow mode={mode} />
        </div>
      )}

      <LearningPanel result={result} />
    </div>
  );
}
