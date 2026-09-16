import React, { useState } from 'react';
import { Terminal, Shield, ArrowRight, Code, Database, Cpu, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function QueryInspector() {
  const [selectedPayload, setSelectedPayload] = useState("admin' --");

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Terminal size={32} style={{ color: '#06b6d4' }} />
          Visual Query Inspector
        </h1>
        <p className="page-subtitle">
          Inspect how database query compilation differs between vulnerable string concatenation, parameter binding, and ORM abstractions.
        </p>
      </div>

      {/* Payload Selector */}
      <div className="card">
        <h3 className="card-title">Select Test Input to Inspect</h3>
        <div className="preset-pills">
          <button className="preset-pill" onClick={() => setSelectedPayload("admin' --")}>
            Payload 1: admin' -- (Comment Bypass)
          </button>
          <button className="preset-pill" onClick={() => setSelectedPayload("' OR '1'='1")}>
            Payload 2: ' OR '1'='1 (Tautology)
          </button>
          <button className="preset-pill" onClick={() => setSelectedPayload("alice")}>
            Payload 3: alice (Normal Input)
          </button>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 600, marginTop: '0.5rem' }}>
          Current Inspected Input: <code className="form-input" style={{ display: 'inline', padding: '0.2rem 0.5rem' }}>{selectedPayload}</code>
        </div>
      </div>

      {/* 3 Technique Visual Comparisons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* 1. Vulnerable Mode */}
        <div className="card" style={{ borderColor: 'var(--color-vulnerable-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>
              1. Vulnerable Query Construction (String Concatenation)
            </h3>
            <span className="badge badge-vulnerable">UNSAFE ❌</span>
          </div>

          <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
              GENERATED SQL QUERY (MERGED COMMAND + DATA):
            </div>
            <pre className="code-block" style={{ color: '#fca5a5' }}>
              <code>{`SELECT * FROM users WHERE username = '${selectedPayload}' AND password = '...'`}</code>
            </pre>
          </div>

          <div style={{ fontSize: '0.88rem', color: '#e5e7eb', lineHeight: 1.5 }}>
            <strong style={{ color: '#ef4444' }}>VULNERABILITY REASON:</strong> The application interpolated untrusted text directly into the SQL string. 
            The database parser compiled code and data in a single pass, allowing single quotes in <code>{selectedPayload}</code> to manipulate the SQL command structure (AST).
          </div>
        </div>

        {/* 2. Parameterized Mode */}
        <div className="card" style={{ borderColor: 'var(--color-secure-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>
              2. Parameterized Query Execution (Prepared Statement)
            </h3>
            <span className="badge badge-secure">PROTECTED ✅</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: '#090d16', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
                COMPILED SQL TEMPLATE:
              </div>
              <pre className="code-block" style={{ color: '#6ee7b7', margin: 0 }}>
                <code>SELECT * FROM users WHERE username = ? AND password = ?</code>
              </pre>
            </div>

            <div style={{ background: '#090d16', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
                BOUND DATA PARAMETERS:
              </div>
              <pre className="code-block" style={{ color: '#67e8f9', margin: 0 }}>
                <code>{`username = "${selectedPayload}"`}</code>
              </pre>
            </div>
          </div>

          <div style={{ padding: '0.75rem', background: 'var(--color-secure-bg)', border: '1px solid var(--color-secure-border)', borderRadius: '8px', textAlign: 'center', fontWeight: 700, color: '#10b981', marginBottom: '0.75rem' }}>
            ✨ KEY GUARANTEE: SQL COMMAND STRUCTURE ≠ USER DATA VALUES
          </div>

          <div style={{ fontSize: '0.88rem', color: '#e5e7eb', lineHeight: 1.5 }}>
            <strong style={{ color: '#10b981' }}>SECURITY GUARANTEE:</strong> The query structure was pre-compiled by SQLite prior to binding inputs. 
            The payload <code>{selectedPayload}</code> was sent separately and evaluated strictly as a literal data string.
          </div>
        </div>

        {/* 3. ORM Mode */}
        <div className="card" style={{ borderColor: 'var(--color-cyan-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>
              3. SQLAlchemy ORM Query Abstraction
            </h3>
            <span className="badge badge-secure">PROTECTED ✅</span>
          </div>

          <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
              PYTHON ORM EXPRESSION:
            </div>
            <pre className="code-block" style={{ color: '#f472b6' }}>
              <code>{`db.query(User).filter(User.username == "${selectedPayload}").first()`}</code>
            </pre>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-cyan)', marginTop: '0.5rem' }}>
              ➔ SQLAlchemy automatically generates parameterized SQL with placeholders <code>(?)</code> under the hood.
            </div>
          </div>

          <div style={{ fontSize: '0.88rem', color: '#e5e7eb', lineHeight: 1.5 }}>
            <strong style={{ color: '#06b6d4' }}>SECURITY GUARANTEE:</strong> Developers write Python object expressions instead of SQL text. 
            SQLAlchemy's Expression Language constructs bound parameter statements automatically.
          </div>
        </div>
      </div>
    </div>
  );
}
