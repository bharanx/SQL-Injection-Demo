import React, { useState } from 'react';
import { Lock, ShieldAlert, ShieldCheck, CheckCircle2, AlertOctagon, Terminal, UserCheck } from 'lucide-react';
import { loginVulnerable, loginParameterized, loginOrm } from '../services/api';
import VisualFlow from '../components/VisualFlow.jsx';
import LearningPanel from '../components/LearningPanel.jsx';

export default function LoginLab({ onScenarioComplete }) {
  const [mode, setMode] = useState('vulnerable'); // 'vulnerable' | 'parameterized' | 'orm'
  const [username, setUsername] = useState("admin' --");
  const [password, setPassword] = useState("wrongpass");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    { label: "Normal Admin Login", user: "admin", pass: "AdminPass123!" },
    { label: "Invalid Password", user: "admin", pass: "wrongpassword" },
    { label: "Comment Bypass (admin' --)", user: "admin' --", pass: "anything" },
    { label: "Tautology Bypass (' OR '1'='1)", user: "' OR '1'='1", pass: "' OR '1'='1" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let res;
      if (mode === 'vulnerable') {
        res = await loginVulnerable(username, password);
        if (res.success && username.includes("'")) onScenarioComplete(1);
      } else if (mode === 'parameterized') {
        res = await loginParameterized(username, password);
        onScenarioComplete(2);
      } else {
        res = await loginOrm(username, password);
        onScenarioComplete(3);
      }
      setResult(res);
    } catch (err) {
      setResult({
        technique: mode,
        security: 'error',
        security_badge: 'ERROR ❌',
        success: False,
        message: `Connection Error: ${err.message}`,
        explanation: 'Ensure FastAPI backend server is running on http://127.0.0.1:8000.',
        query_executed: 'Failed to connect to server',
        rows_matched: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Lock size={32} style={{ color: '#06b6d4' }} />
          SecureBank Demo — Login Security Lab
        </h1>
        <p className="page-subtitle">
          Test identical input payloads against Vulnerable and Secure login implementations.
        </p>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>SELECT BACKEND SECURITY IMPLEMENTATION:</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${mode === 'vulnerable' ? 'btn-vulnerable' : 'btn-secondary'}`}
            onClick={() => { setMode('vulnerable'); setResult(null); }}
          >
            <AlertOctagon size={16} /> [ VULNERABLE MODE ]
          </button>
          <button
            className={`btn ${mode === 'parameterized' ? 'btn-secure' : 'btn-secondary'}`}
            onClick={() => { setMode('parameterized'); setResult(null); }}
          >
            <ShieldCheck size={16} /> [ SECURE: Parameterized ]
          </button>
          <button
            className={`btn ${mode === 'orm' ? 'btn-secure' : 'btn-secondary'}`}
            style={mode === 'orm' ? { backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9', borderColor: 'rgba(6, 182, 212, 0.5)' } : {}}
            onClick={() => { setMode('orm'); setResult(null); }}
          >
            <ShieldCheck size={16} /> [ SECURE: ORM ]
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Realistic SecureBank Login Portal UI */}
        <div className="card" style={{ background: '#0b0f19', border: '1px solid var(--border-highlight)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>🏦 SecureBank</div>
            <div style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Training Portal • Local Lab
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              SQL Injection Training Environment
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Try Educational Input Chips:
            </div>
            <div className="preset-pills">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  className="preset-pill"
                  onClick={() => { setUsername(p.user); setPassword(p.pass); }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (e.g. admin or admin' --)"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn ${mode === 'vulnerable' ? 'btn-vulnerable' : 'btn-secure'}`}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Processing Backend Query...' : `[ LOGIN (${mode.toUpperCase()}) ]`}
            </button>
          </form>
        </div>

        {/* Live Execution Output & Query Inspector */}
        <div>
          {result ? (
            <div className="card" style={{
              borderColor: result.security === 'unsafe' && result.success ? 'var(--color-vulnerable-border)' : 'var(--color-secure-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Login Execution Output</h3>
                <span className={`badge ${result.security === 'unsafe' && result.success ? 'badge-vulnerable' : 'badge-secure'}`}>
                  {result.security_badge}
                </span>
              </div>

              <div style={{
                padding: '0.85rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                backgroundColor: result.success && result.security === 'unsafe' ? 'var(--color-vulnerable-bg)' : 'var(--color-secure-bg)',
                borderLeft: `4px solid ${result.success && result.security === 'unsafe' ? 'var(--color-vulnerable)' : 'var(--color-secure)'}`
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: result.success && result.security === 'unsafe' ? '#fca5a5' : '#6ee7b7' }}>
                  {result.message}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Rows Matched: {result.rows_matched}
                </div>
              </div>

              {result.user_found && (
                <div style={{ background: '#090d16', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <UserCheck size={14} /> Authenticated User Profile:
                  </div>
                  <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#d1d5db' }}>
                    ID: {result.user_found.id} | User: {result.user_found.username} | Role: {result.user_found.role}
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>
                  EXECUTED DATABASE QUERY:
                </div>
                <pre className="code-block" style={{ fontSize: '0.82rem' }}>
                  <code>{result.query_executed}</code>
                </pre>
                {result.parameters && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-cyan)', marginTop: '0.35rem' }}>
                    Bound Parameters: {JSON.stringify(result.parameters)}
                  </div>
                )}
              </div>

              <VisualFlow mode={mode} />
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              <Terminal size={40} style={{ color: '#06b6d4', margin: '0 auto 1rem', opacity: 0.7 }} />
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Ready for Login Test</h3>
              <p style={{ fontSize: '0.88rem' }}>
                Select an educational preset chip or enter custom credentials on the left portal form and click <strong>LOGIN</strong> to inspect live database query execution.
              </p>
            </div>
          )}
        </div>
      </div>

      <LearningPanel result={result} />
    </div>
  );
}
