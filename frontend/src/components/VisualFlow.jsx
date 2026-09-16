import React from 'react';
import { ArrowRight, AlertTriangle, ShieldCheck, Database, Cpu, User } from 'lucide-react';

export default function VisualFlow({ mode = 'vulnerable' }) {
  if (mode === 'vulnerable') {
    return (
      <div style={{ background: '#090d16', border: '1px solid var(--color-vulnerable-border)', borderRadius: '10px', padding: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-vulnerable)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertTriangle size={15} /> VISUAL QUERY EXECUTION FLOW
          </span>
          <span className="badge badge-vulnerable">UNSAFE ❌</span>
        </div>

        <div className="flow-container" style={{ padding: '0.5rem 0' }}>
          <div className="flow-step">
            <User size={18} style={{ color: '#06b6d4', margin: '0 auto 0.25rem' }} />
            <div className="flow-step-title">User Input</div>
            <div className="flow-step-desc">Untrusted payload string</div>
          </div>

          <div className="flow-arrow" style={{ color: '#ef4444' }}>➔</div>

          <div className="flow-step" style={{ borderTop: '3px solid #ef4444' }}>
            <Cpu size={18} style={{ color: '#ef4444', margin: '0 auto 0.25rem' }} />
            <div className="flow-step-title">String Concatenation</div>
            <div className="flow-step-desc">f"SELECT ... '{'{input}'}'"</div>
          </div>

          <div className="flow-arrow" style={{ color: '#ef4444' }}>➔</div>

          <div className="flow-step" style={{ borderTop: '3px solid #ef4444' }}>
            <Database size={18} style={{ color: '#ef4444', margin: '0 auto 0.25rem' }} />
            <div className="flow-step-title">SQLite Parser</div>
            <div className="flow-step-desc">Parses input as SQL code</div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'parameterized') {
    return (
      <div style={{ background: '#090d16', border: '1px solid var(--color-secure-border)', borderRadius: '10px', padding: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-secure)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={15} /> VISUAL QUERY EXECUTION FLOW
          </span>
          <span className="badge badge-secure">PROTECTED ✅</span>
        </div>

        <div className="flow-container" style={{ padding: '0.5rem 0' }}>
          <div className="flow-step">
            <User size={18} style={{ color: '#06b6d4', margin: '0 auto 0.25rem' }} />
            <div className="flow-step-title">User Input</div>
            <div className="flow-step-desc">Bound parameter data</div>
          </div>

          <div className="flow-arrow" style={{ color: '#10b981' }}>➔</div>

          <div className="flow-step" style={{ borderTop: '3px solid #10b981' }}>
            <Cpu size={18} style={{ color: '#10b981', margin: '0 auto 0.25rem' }} />
            <div className="flow-step-title">Parameter Binding</div>
            <div className="flow-step-desc">WHERE username = ?</div>
          </div>

          <div className="flow-arrow" style={{ color: '#10b981' }}>➔</div>

          <div className="flow-step" style={{ borderTop: '3px solid #10b981' }}>
            <Database size={18} style={{ color: '#10b981', margin: '0 auto 0.25rem' }} />
            <div className="flow-step-title">SQLite Storage</div>
            <div className="flow-step-desc">Evaluated purely as literal data</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#090d16', border: '1px solid var(--color-cyan-border)', borderRadius: '10px', padding: '1rem', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={15} /> VISUAL ORM QUERY EXECUTION FLOW
        </span>
        <span className="badge badge-secure">PROTECTED ✅</span>
      </div>

      <div className="flow-container" style={{ padding: '0.5rem 0' }}>
        <div className="flow-step">
          <User size={18} style={{ color: '#06b6d4', margin: '0 auto 0.25rem' }} />
          <div className="flow-step-title">User Input</div>
          <div className="flow-step-desc">Python object property</div>
        </div>

        <div className="flow-arrow" style={{ color: '#06b6d4' }}>➔</div>

        <div className="flow-step" style={{ borderTop: '3px solid #06b6d4' }}>
          <Cpu size={18} style={{ color: '#06b6d4', margin: '0 auto 0.25rem' }} />
          <div className="flow-step-title">SQLAlchemy ORM</div>
          <div className="flow-step-desc">.filter(User.username == val)</div>
        </div>

        <div className="flow-arrow" style={{ color: '#06b6d4' }}>➔</div>

        <div className="flow-step" style={{ borderTop: '3px solid #06b6d4' }}>
          <Database size={18} style={{ color: '#06b6d4', margin: '0 auto 0.25rem' }} />
          <div className="flow-step-title">Parameterized SQL</div>
          <div className="flow-step-desc">Automated ? Placeholder</div>
        </div>
      </div>
    </div>
  );
}
