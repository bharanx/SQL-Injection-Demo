import React from 'react';
import { AlertTriangle, ShieldCheck, Database, Lock, ArrowRight, Server } from 'lucide-react';

export default function DashboardOverview({ setActiveTab }) {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <ShieldCheck size={32} style={{ color: '#06b6d4' }} />
          SQL Injection Prevention Lab
        </h1>
        <p className="page-subtitle">
          Parameterized Queries • SQLAlchemy ORM • Pydantic Input Validation
        </p>
      </div>

      {/* 4 Cards requested by prompt */}
      <div className="metrics-grid">
        <div className="metric-card vulnerable">
          <div className="metric-header">
            <span className="metric-name">1. Vulnerable SQL</span>
            <span className="badge badge-vulnerable">Status: Unsafe ❌</span>
          </div>
          <p className="metric-desc">
            Direct string concatenation directly merges user input into SQL commands, allowing malicious payload syntax evaluation.
          </p>
        </div>

        <div className="metric-card secure-param">
          <div className="metric-header">
            <span className="metric-name">2. Parameterized Query</span>
            <span className="badge badge-secure">Status: Protected ✅</span>
          </div>
          <p className="metric-desc">
            Pre-compiles SQL template and binds inputs strictly as literal data values using SQLite <code>?</code> placeholders.
          </p>
        </div>

        <div className="metric-card secure-orm">
          <div className="metric-header">
            <span className="metric-name">3. SQLAlchemy ORM</span>
            <span className="badge badge-secure">Status: Protected ✅</span>
          </div>
          <p className="metric-desc">
            Object-relational mapping abstracts database operations into safe Python expressions with built-in parameterization.
          </p>
        </div>

        <div className="metric-card defense-depth">
          <div className="metric-header">
            <span className="metric-name">4. Input Validation</span>
            <span className="badge badge-warning">Status: Additional Layer 🛡️</span>
          </div>
          <p className="metric-desc">
            Pydantic & Regex rules validate character sets and length boundaries prior to reaching the database layer (Defense in Depth).
          </p>
        </div>
      </div>

      {/* Interactive System Flow Diagram */}
      <div className="card">
        <h2 className="card-title">
          <Server size={20} style={{ color: '#10b981' }} />
          Secure Architecture Execution Flow
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Data flow from user input through perimeter validation, database abstraction layers, and isolated storage:
        </p>

        <div className="flow-container">
          <div className="flow-step">
            <div style={{ color: '#06b6d4', marginBottom: '0.25rem' }}>👤 USER</div>
            <div className="flow-step-title">User Input</div>
            <div className="flow-step-desc">Login credentials / Payloads</div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step" style={{ borderTop: '3px solid #f59e0b' }}>
            <div style={{ color: '#f59e0b', marginBottom: '0.25rem' }}>🛡️ STEP 1</div>
            <div className="flow-step-title">Input Validation</div>
            <div className="flow-step-desc">Pydantic / Regex Rules</div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step" style={{ borderTop: '3px solid #10b981' }}>
            <div style={{ color: '#10b981', marginBottom: '0.25rem' }}>⚡ STEP 2</div>
            <div className="flow-step-title">Query Engine</div>
            <div className="flow-step-desc">Parameterized / ORM Binding</div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step">
            <div style={{ color: '#a855f7', marginBottom: '0.25rem' }}>💾 STORAGE</div>
            <div className="flow-step-title">SQLite DB</div>
            <div className="flow-step-desc">Isolated Test Records</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.1))', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
          🚀 Ready for Faculty Live Demonstration?
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Test harmless educational injection payloads like <code>admin' --</code> side-by-side against vulnerable and secure backend API endpoints.
        </p>
        <button className="btn btn-secure" onClick={() => setActiveTab('demo')}>
          Launch Interactive Query Demo <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
