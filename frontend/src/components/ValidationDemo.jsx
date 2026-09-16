import React, { useState } from 'react';
import { ShieldCheck, Check, X, AlertTriangle, Play } from 'lucide-react';

export default function ValidationDemo() {
  const [valUser, setValUser] = useState("alice_smith");
  const [valPass, setValPass] = useState("AlicePass2026!");
  const [valResult, setValResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testValidation = async (user, pass) => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/validate-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      const data = await res.json();
      setValResult(data);
    } catch (err) {
      setValResult({
        validation_passed: false,
        validation_errors: [`Network Error: ${err.message}`],
        message: 'Could not connect to backend validation route.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <ShieldCheck size={32} style={{ color: '#f59e0b' }} />
          Input Validation Rules & Perimeter Protection
        </h1>
        <p className="page-subtitle">
          Pydantic Schema Validation — Defense in Depth (Additional Protection Layer)
        </p>
      </div>

      {/* Rules Summary */}
      <div className="card">
        <h2 className="card-title">Enforced Validation Rules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#06b6d4', marginBottom: '0.5rem', fontWeight: 700 }}>Username Rules</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: '#d1d5db', lineHeight: 1.7 }}>
              <li><Check size={14} style={{ color: '#10b981', marginRight: '6px' }} /> 3–30 characters length</li>
              <li><Check size={14} style={{ color: '#10b981', marginRight: '6px' }} /> Letters (a-z, A-Z)</li>
              <li><Check size={14} style={{ color: '#10b981', marginRight: '6px' }} /> Numbers (0-9)</li>
              <li><Check size={14} style={{ color: '#10b981', marginRight: '6px' }} /> Underscores (_)</li>
              <li><X size={14} style={{ color: '#ef4444', marginRight: '6px' }} /> Single quotes, spaces, dashes blocked</li>
            </ul>
          </div>

          <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#06b6d4', marginBottom: '0.5rem', fontWeight: 700 }}>Password Rules</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: '#d1d5db', lineHeight: 1.7 }}>
              <li><Check size={14} style={{ color: '#10b981', marginRight: '6px' }} /> 8–50 characters length</li>
              <li><Check size={14} style={{ color: '#10b981', marginRight: '6px' }} /> Standard complexity</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Tester */}
      <div className="card">
        <h3 className="card-title">Interactive Input Rule Tester</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Test inputs against backend Pydantic validation before database execution occurs:
        </p>

        <div className="preset-pills">
          <button className="preset-pill" onClick={() => { setValUser("alice_smith"); setValPass("AlicePass2026!"); testValidation("alice_smith", "AlicePass2026!"); }}>
            VALID: alice_smith
          </button>
          <button className="preset-pill" onClick={() => { setValUser("admin' --"); setValPass("pass1234"); testValidation("admin' --", "pass1234"); }}>
            INVALID: admin' -- (Quotes/Comments)
          </button>
          <button className="preset-pill" onClick={() => { setValUser("ab"); setValPass("short"); testValidation("ab", "short"); }}>
            INVALID: ab (Short length)
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={valUser}
              onChange={(e) => setValUser(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="text"
              className="form-input"
              value={valPass}
              onChange={(e) => setValPass(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-secondary" onClick={() => testValidation(valUser, valPass)} disabled={loading}>
          <Play size={16} /> Run Validation Check
        </button>

        {valResult && (
          <div style={{ marginTop: '1.25rem' }}>
            {valResult.validation_passed ? (
              <div style={{ padding: '1rem', background: 'var(--color-secure-bg)', border: '1px solid var(--color-secure-border)', borderRadius: '8px' }}>
                <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>
                  ✓ VALID INPUT → Accepted by Perimeter Rules
                </div>
                <div style={{ fontSize: '0.88rem', color: '#e5e7eb' }}>
                  {valResult.message}
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', background: 'var(--color-vulnerable-bg)', border: '1px solid var(--color-vulnerable-border)', borderRadius: '8px' }}>
                <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>
                  ❌ INVALID INPUT → Rejected Before Database Query
                </div>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#fca5a5' }}>
                  {valResult.validation_errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Critical Defense Note */}
      <div className="card" style={{ borderColor: 'var(--color-warning-border)' }}>
        <h3 className="card-title" style={{ color: '#f59e0b' }}>
          <AlertTriangle size={20} />
          IMPORTANT ARCHITECTURAL NOTE: Input Validation is Defense in Depth!
        </h3>
        <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Input validation acts as a perimeter filter to stop unexpected characters before processing. 
          <strong> However, input validation must NEVER be relied upon as the sole defense against SQL Injection!</strong>
          <br /><br />
          Why? Complex input validation filters can often be bypassed by sophisticated encoding tricks, 
          and legitimate user data may require characters like apostrophes (e.g. <code>O'Connor</code> or <code>D'Angelo</code>). 
          <strong> Parameterized queries and safe ORMs must ALWAYS serve as the primary database defense.</strong>
        </p>
      </div>
    </div>
  );
}
