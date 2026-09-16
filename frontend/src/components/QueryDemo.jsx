import React, { useState } from 'react';
import { Terminal, Shield, AlertOctagon, CheckCircle, Code, UserCheck, HelpCircle } from 'lucide-react';

export default function QueryDemo() {
  const [username, setUsername] = useState("admin' --");
  const [password, setPassword] = useState("wrongpass");
  const [loading, setLoading] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState('');
  const [responseResult, setResponseResult] = useState(null);

  const presets = [
    { label: "Valid Admin Login", user: "admin", pass: "AdminPass123!" },
    { label: "SQLi Comment Bypass (admin' --)", user: "admin' --", pass: "anything" },
    { label: "SQLi Tautology (' OR '1'='1)", user: "' OR '1'='1", pass: "' OR '1'='1" },
    { label: "Valid Student (alice_smith)", user: "alice_smith", pass: "AlicePass2026!" },
  ];

  const handleTest = async (endpoint, techniqueName) => {
    setLoading(true);
    setActiveEndpoint(techniqueName);
    setResponseResult(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      setResponseResult(data);
    } catch (err) {
      setResponseResult({
        technique: techniqueName,
        status: 'error',
        security_badge: 'ERROR ❌',
        success: false,
        message: `Network/Server Error: ${err.message}`,
        explanation: 'Ensure backend server is running on http://127.0.0.1:8000.',
        query_executed: 'Connection failed',
        records_returned_count: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Terminal size={32} style={{ color: '#06b6d4' }} />
          SQL Injection Interactive Test Bench
        </h1>
        <p className="page-subtitle">
          Test identical input payloads side-by-side against Vulnerable, Parameterized, and ORM backend logic.
        </p>
      </div>

      {/* Input Sandbox Card */}
      <div className="card">
        <h2 className="card-title">
          <Code size={20} style={{ color: '#10b981' }} />
          Step 1: Select Preset Payload or Enter Test Inputs
        </h2>

        <div className="preset-pills">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
            Quick Presets for Learning & Exam Demo:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              className="preset-pill"
              onClick={() => {
                setUsername(p.user);
                setPassword(p.pass);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Username Input</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or admin' --"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password Input</label>
            <input
              type="text"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. AdminPass123!"
            />
          </div>
        </div>

        <div className="btn-group">
          <button
            className="btn btn-vulnerable"
            onClick={() => handleTest('/login/vulnerable', 'Vulnerable String Concatenation')}
            disabled={loading}
          >
            <AlertOctagon size={18} />
            [ Test Vulnerable ]
          </button>

          <button
            className="btn btn-secure"
            onClick={() => handleTest('/login/parameterized', 'Parameterized Query')}
            disabled={loading}
          >
            <CheckCircle size={18} />
            [ Test Parameterized ]
          </button>

          <button
            className="btn btn-secure"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9', borderColor: 'rgba(6, 182, 212, 0.5)' }}
            onClick={() => handleTest('/login/orm', 'SQLAlchemy ORM')}
            disabled={loading}
          >
            <Shield size={18} />
            [ Test SQLAlchemy ORM ]
          </button>
        </div>
      </div>

      {/* Result Display Section */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ color: '#06b6d4', fontWeight: 600 }}>Executing backend query using {activeEndpoint}...</div>
        </div>
      )}

      {responseResult && !loading && (
        <div className="card" style={{
          borderColor: responseResult.status === 'vulnerable' && responseResult.success ? 'var(--color-vulnerable-border)' : 'var(--color-secure-border)',
          boxShadow: responseResult.status === 'vulnerable' && responseResult.success ? '0 0 20px rgba(239, 68, 68, 0.15)' : '0 0 20px rgba(16, 185, 129, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              Execution Result: {responseResult.technique}
            </h3>
            <span className={`badge ${
              responseResult.status === 'vulnerable' && responseResult.success ? 'badge-vulnerable' : 'badge-secure'
            }`}>
              {responseResult.security_badge}
            </span>
          </div>

          <div style={{
            padding: '0.9rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            backgroundColor: responseResult.success && responseResult.status === 'vulnerable' ? 'var(--color-vulnerable-bg)' : 'var(--color-secure-bg)',
            borderLeft: `4px solid ${responseResult.success && responseResult.status === 'vulnerable' ? 'var(--color-vulnerable)' : 'var(--color-secure)'}`
          }}>
            <strong>Status Message:</strong> {responseResult.message}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
              RAW QUERY EXECUTED AT DATABASE LAYER:
            </div>
            <pre className="code-block">
              <code>{responseResult.query_executed}</code>
            </pre>
            {responseResult.parameters && (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', marginTop: '0.35rem' }}>
                Bound Parameters: {JSON.stringify(responseResult.parameters)}
              </div>
            )}
          </div>

          {responseResult.user_found && (
            <div style={{ marginBottom: '1rem', background: '#090d16', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <UserCheck size={16} /> User Record Retrieved From Database:
              </div>
              <div style={{ fontSize: '0.85rem', color: '#d1d5db', fontFamily: 'var(--font-mono)' }}>
                ID: {responseResult.user_found.id} | Username: {responseResult.user_found.username} | Role: {responseResult.user_found.role} | Email: {responseResult.user_found.email}
              </div>
            </div>
          )}

          {/* Permanently Visible Detailed Educational Breakdown */}
          <div style={{ background: '#090d16', border: '1px solid var(--color-cyan-border)', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.35rem' }}>
              <HelpCircle size={16} /> EDUCATIONAL & FACULTY EXPLANATION:
            </div>
            <p style={{ fontSize: '0.9rem', color: '#e5e7eb', lineHeight: 1.5 }}>
              {responseResult.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
