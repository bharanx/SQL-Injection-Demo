import React from 'react';
import { Shield, Play, BookOpen, ArrowRight, Lock, KeyRound, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HomeLanding({ setActiveTab }) {
  const cards = [
    {
      num: "01",
      title: "SQL Injection",
      status: "Unsafe ❌",
      badgeClass: "badge-vulnerable",
      desc: "Unsafe string concatenation merges user input into SQL commands, allowing single quotes and comments to alter query execution."
    },
    {
      num: "02",
      title: "Parameterized Queries",
      status: "Protected ✅",
      badgeClass: "badge-secure",
      desc: "Prepared statements pre-compile the SQL template and bind user input strictly as literal data values using placeholders (?)."
    },
    {
      num: "03",
      title: "SQLAlchemy ORM",
      status: "Protected ✅",
      badgeClass: "badge-secure",
      desc: "Object-relational mapping abstracts SQL code using Python object filter expressions with built-in parameterization."
    },
    {
      num: "04",
      title: "Input Validation",
      status: "Defense in Depth 🛡️",
      badgeClass: "badge-warning",
      desc: "Pydantic & regex rules restrict character sets and length boundaries before input reaches the database layer."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0d1322 0%, #061e29 50%, #170d2b 100%)',
        borderColor: 'rgba(6, 182, 212, 0.4)',
        padding: '3rem 2rem',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', color: '#67e8f9', fontWeight: 700, marginBottom: '1rem' }}>
          <Shield size={16} /> INTERACTIVE CYBERSECURITY TRAINING LAB
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          SQL Injection Prevention Lab
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#9ca3af', maxWidth: '700px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
          Understand the vulnerability. Try it locally. See the defense in action.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secure" style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }} onClick={() => setActiveTab('login')}>
            <Play size={20} /> [ START PLAYGROUND ]
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }} onClick={() => setActiveTab('about')}>
            <BookOpen size={20} /> [ LEARN HOW IT WORKS ]
          </button>
        </div>
      </div>

      {/* 4 Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {cards.map((c, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-cyan)', opacity: 0.6 }}>{c.num}</span>
                <span className={`badge ${c.badgeClass}`}>{c.status}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{c.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* How This Lab Works Flowchart */}
      <div className="card">
        <h2 className="card-title">How This Interactive Lab Works</h2>
        <div className="flow-container">
          <div className="flow-step">
            <div style={{ color: '#06b6d4', fontWeight: 700 }}>1. Enter Input</div>
            <div className="flow-step-desc">Enter normal credentials or test injection payloads</div>
          </div>
          <div className="flow-arrow">➔</div>
          <div className="flow-step" style={{ borderTop: '3px solid #ef4444' }}>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>2. Vulnerable App</div>
            <div className="flow-step-desc">Test string concatenation logic</div>
          </div>
          <div className="flow-arrow">➔</div>
          <div className="flow-step" style={{ borderTop: '3px solid #10b981' }}>
            <div style={{ color: '#10b981', fontWeight: 700 }}>3. Secure App</div>
            <div className="flow-step-desc">Test Parameterized / ORM logic</div>
          </div>
          <div className="flow-arrow">➔</div>
          <div className="flow-step">
            <div style={{ color: '#a855f7', fontWeight: 700 }}>4. Compare Results</div>
            <div className="flow-step-desc">Observe query traces in Query Inspector</div>
          </div>
        </div>
      </div>
    </div>
  );
}
