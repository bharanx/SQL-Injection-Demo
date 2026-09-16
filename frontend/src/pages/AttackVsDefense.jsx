import React, { useState } from 'react';
import { GitCompare, Play, AlertOctagon, ShieldCheck, Database, Shield } from 'lucide-react';
import { loginVulnerable, loginParameterized, loginOrm, validateInputFields } from '../services/api';

export default function AttackVsDefense() {
  const [inputVal, setInputVal] = useState("admin' --");
  const [passVal, setPassVal] = useState("wrongpass");
  const [selectedMethod, setSelectedMethod] = useState('vulnerable');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const runComparisonTest = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      let res;
      if (selectedMethod === 'vulnerable') {
        res = await loginVulnerable(inputVal, passVal);
      } else if (selectedMethod === 'parameterized') {
        res = await loginParameterized(inputVal, passVal);
      } else if (selectedMethod === 'orm') {
        res = await loginOrm(inputVal, passVal);
      } else {
        res = await validateInputFields({ username: inputVal, email: 'test@lab.local', search: inputVal });
      }
      setTestResult(res);
    } catch (err) {
      setTestResult({ message: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <GitCompare size={32} style={{ color: '#06b6d4' }} />
          Attack vs Defense Split-Screen Mode
        </h1>
        <p className="page-subtitle">
          Test identical payload inputs side-by-side against all security modes.
        </p>
      </div>

      {/* Split Screen Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left Column: Attack / Input */}
        <div className="card">
          <h3 className="card-title" style={{ color: '#ef4444' }}>
            <AlertOctagon size={18} /> LEFT: ATTACK / INPUT
          </h3>

          <div className="preset-pills" style={{ marginBottom: '1rem' }}>
            <button className="preset-pill" onClick={() => setInputVal("admin' --")}>
              admin' -- (Comment)
            </button>
            <button className="preset-pill" onClick={() => setInputVal("' OR '1'='1")}>
              ' OR '1'='1 (Tautology)
            </button>
            <button className="preset-pill" onClick={() => setInputVal("alice")}>
              alice (Valid User)
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Username Payload</label>
            <input
              type="text"
              className="form-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password Payload</label>
            <input
              type="text"
              className="form-input"
              value={passVal}
              onChange={(e) => setPassVal(e.target.value)}
            />
          </div>

          <button className="btn btn-secure" style={{ width: '100%', padding: '0.85rem' }} onClick={runComparisonTest} disabled={loading}>
            <Play size={18} /> {loading ? 'Running Test...' : '[ RUN TEST ]'}
          </button>
        </div>

        {/* Right Column: Defense Method Selection */}
        <div className="card">
          <h3 className="card-title" style={{ color: '#10b981' }}>
            <ShieldCheck size={18} /> RIGHT: SECURITY METHOD
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              { id: 'vulnerable', label: 'Vulnerable (String Concatenation)', desc: 'Direct string interpolation into SQL query text' },
              { id: 'parameterized', label: 'Parameterized Query', desc: 'Pre-compiled SQL template with ? placeholders' },
              { id: 'orm', label: 'SQLAlchemy ORM', desc: 'Python object filter expression with automated parameterization' },
              { id: 'validation', label: 'Input Validation', desc: 'Perimeter Pydantic / Regex rule checking' },
            ].map((m) => (
              <label
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  background: selectedMethod === m.id ? 'rgba(6, 182, 212, 0.12)' : '#090d16',
                  border: `1px solid ${selectedMethod === m.id ? 'var(--color-cyan-border)' : 'var(--border-color)'}`,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="defense_method"
                  checked={selectedMethod === m.id}
                  onChange={() => setSelectedMethod(m.id)}
                  style={{ marginTop: '3px' }}
                />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{m.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Observation Output Card */}
      {testResult && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="card-title" style={{ margin: 0 }}>OBSERVATION RESULTS</h3>
            <span className={`badge ${testResult.security === 'unsafe' ? 'badge-vulnerable' : 'badge-secure'}`}>
              {testResult.security_badge}
            </span>
          </div>

          <div style={{ padding: '0.85rem', background: '#090d16', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{testResult.message}</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{testResult.explanation}</p>
          </div>

          {testResult.query_executed && (
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>
                EXECUTED QUERY:
              </div>
              <pre className="code-block" style={{ fontSize: '0.82rem' }}>
                <code>{testResult.query_executed}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
