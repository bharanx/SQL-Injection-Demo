import React from 'react';
import { HelpCircle, AlertTriangle, ShieldCheck, Database } from 'lucide-react';

export default function LearningPanel({ result }) {
  if (!result) return null;

  return (
    <div className="card" style={{ background: '#090d16', borderColor: 'var(--color-cyan-border)', marginTop: '1.25rem' }}>
      <h3 className="card-title" style={{ color: '#06b6d4', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
        <HelpCircle size={18} /> WHAT JUST HAPPENED?
      </h3>

      <p style={{ fontSize: '0.9rem', color: '#e5e7eb', lineHeight: 1.5, marginBottom: '0.75rem' }}>
        {result.explanation}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
        <div style={{ fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Executed Technique:</span>
          <div style={{ color: '#fff', fontWeight: 700 }}>{result.technique}</div>
        </div>

        <div style={{ fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Database Rows Matched:</span>
          <div style={{ color: result.rows_matched > 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
            {result.rows_matched} record(s)
          </div>
        </div>

        <div style={{ fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Security Status:</span>
          <div>
            <span className={`badge ${result.security === 'unsafe' ? 'badge-vulnerable' : 'badge-secure'}`}>
              {result.security_badge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
