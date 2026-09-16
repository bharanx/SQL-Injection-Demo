import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, AlertTriangle } from 'lucide-react';
import { validateInputFields } from '../services/api';

export default function ValidationLab({ onScenarioComplete }) {
  const [username, setUsername] = useState("student123");
  const [email, setEmail] = useState("student@cyberlab.local");
  const [search, setSearch] = useState("alice");
  const [valResult, setValResult] = useState(null);

  const runValidation = async (u, e, s) => {
    try {
      const res = await validateInputFields({ username: u, email: e, search: s });
      setValResult(res);
      if (res.success) onScenarioComplete(5);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    runValidation(username, email, search);
  }, [username, email, search]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <ShieldCheck size={32} style={{ color: '#f59e0b' }} />
          Input Validation Security Lab
        </h1>
        <p className="page-subtitle">
          Real-time perimeter rule checker — Defense in Depth (Additional Security Layer).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Form Input Tester */}
        <div className="card">
          <h3 className="card-title">Interactive Field Rule Checker</h3>

          <div className="preset-pills" style={{ marginBottom: '1rem' }}>
            <button className="preset-pill" onClick={() => { setUsername("student123"); setEmail("student@cyberlab.local"); setSearch("alice"); }}>
              VALID: Standard Input
            </button>
            <button className="preset-pill" onClick={() => { setUsername("admin' --"); setEmail("invalid_email"); setSearch("admin'; DROP--"); }}>
              INVALID: Disallowed SQL Characters
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Username Field</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {valResult?.field_results?.username && (
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: valResult.field_results.username.valid ? '#10b981' : '#ef4444' }}>
                {valResult.field_results.username.valid ? '✓ Valid Username' : `✕ ${valResult.field_results.username.errors.join(', ')}`}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address Field</label>
            <input
              type="text"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {valResult?.field_results?.email && (
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: valResult.field_results.email.valid ? '#10b981' : '#ef4444' }}>
                {valResult.field_results.email.valid ? '✓ Valid Email Format' : `✕ ${valResult.field_results.email.errors.join(', ')}`}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Search Query Field</label>
            <input
              type="text"
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {valResult?.field_results?.search && (
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: valResult.field_results.search.valid ? '#10b981' : '#ef4444' }}>
                {valResult.field_results.search.valid ? '✓ Valid Search Query' : `✕ ${valResult.field_results.search.errors.join(', ')}`}
              </div>
            )}
          </div>
        </div>

        {/* Validation Status & Explanation */}
        <div className="card">
          <h3 className="card-title">Perimeter Validation Status</h3>

          {valResult && (
            <div>
              <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', backgroundColor: valResult.success ? 'var(--color-secure-bg)' : 'var(--color-vulnerable-bg)', borderLeft: `4px solid ${valResult.success ? 'var(--color-secure)' : 'var(--color-vulnerable)'}` }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: valResult.success ? '#10b981' : '#ef4444' }}>
                  {valResult.success ? '✓ VALID INPUT → Accepted by Perimeter Rules' : '✕ REJECTED BY VALIDATION → Blocked Before DB Operation'}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#e5e7eb', marginTop: '0.35rem' }}>
                  {valResult.message}
                </div>
              </div>

              {valResult.errors.length > 0 && (
                <div style={{ marginBottom: '1rem', background: '#090d16', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.35rem' }}>
                    Rule Violations Detected:
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#fca5a5' }}>
                    {valResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div style={{ background: '#090d16', border: '1px solid var(--color-warning-border)', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
              <AlertTriangle size={16} /> DEFENSE IN DEPTH LESSON
            </div>
            <p style={{ fontSize: '0.85rem', color: '#d1d5db', lineHeight: 1.5 }}>
              Input validation filters out unexpected characters early. However, <strong>it should NEVER be used as the sole defense against SQL Injection</strong>. Legitimate names can contain single quotes (e.g. <code>O'Connor</code>). Parameterized queries / ORMs must always be used at the database layer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
