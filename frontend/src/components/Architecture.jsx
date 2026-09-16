import React from 'react';
import { Network, Server, Database, Shield, Cpu, User } from 'lucide-react';

export default function Architecture() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Network size={32} style={{ color: '#06b6d4' }} />
          System Architecture Diagram
        </h1>
        <p className="page-subtitle">
          Clean visual breakdown of the multi-layered security lab environment.
        </p>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 className="card-title" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
          Application Data & Security Pipeline
        </h2>

        {/* User Card */}
        <div style={{ display: 'inline-block', width: '220px', background: '#0d1322', border: '1px solid var(--color-cyan-border)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
          <User size={24} style={{ color: '#06b6d4', marginBottom: '0.25rem' }} />
          <div style={{ fontWeight: 700, color: '#fff' }}>USER</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Browser / Client Input</div>
        </div>

        <div style={{ color: '#06b6d4', fontSize: '1.5rem', margin: '0.5rem 0' }}>↓</div>

        {/* React Frontend Card */}
        <div style={{ display: 'inline-block', width: '280px', background: 'var(--bg-card)', border: '1px solid var(--border-highlight)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
          <Cpu size={24} style={{ color: '#61dafb', marginBottom: '0.25rem' }} />
          <div style={{ fontWeight: 700, color: '#fff' }}>React + Vite Frontend</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cybersecurity Dashboard UI (Port 5173)</div>
        </div>

        <div style={{ color: '#06b6d4', fontSize: '1.5rem', margin: '0.5rem 0' }}>↓</div>

        {/* FastAPI Backend Card */}
        <div style={{ display: 'inline-block', width: '320px', background: 'var(--bg-card)', border: '1px solid var(--border-highlight)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
          <Server size={24} style={{ color: '#10b981', marginBottom: '0.25rem' }} />
          <div style={{ fontWeight: 700, color: '#fff' }}>FastAPI Backend (Uvicorn)</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REST API Endpoints & Router (Port 8000)</div>
        </div>

        <div style={{ color: '#06b6d4', fontSize: '1.5rem', margin: '0.5rem 0' }}>↓</div>

        {/* Validation & Query Layer Parallel Cards */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={{ flex: '1', maxWidth: '280px', background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: '10px', padding: '1rem' }}>
            <Shield size={24} style={{ color: '#f59e0b', marginBottom: '0.25rem' }} />
            <div style={{ fontWeight: 700, color: '#fff' }}>Input Validation</div>
            <div style={{ fontSize: '0.75rem', color: '#fcd34d' }}>Pydantic / Regex Rules</div>
          </div>

          <div style={{ flex: '1', maxWidth: '340px', background: 'var(--color-secure-bg)', border: '1px solid var(--color-secure-border)', borderRadius: '10px', padding: '1rem' }}>
            <Database size={24} style={{ color: '#10b981', marginBottom: '0.25rem' }} />
            <div style={{ fontWeight: 700, color: '#fff' }}>Query Layer</div>
            <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>
              Parameterized Queries <code>(?)</code> | SQLAlchemy ORM
            </div>
          </div>
        </div>

        <div style={{ color: '#06b6d4', fontSize: '1.5rem', margin: '0.5rem 0' }}>↓</div>

        {/* SQLite Database Card */}
        <div style={{ display: 'inline-block', width: '300px', background: '#0f172a', border: '1px solid #a855f7', borderRadius: '10px', padding: '1rem' }}>
          <Database size={24} style={{ color: '#a855f7', marginBottom: '0.25rem' }} />
          <div style={{ fontWeight: 700, color: '#fff' }}>SQLite Database (sql_lab.db)</div>
          <div style={{ fontSize: '0.75rem', color: '#d8b4fe' }}>Isolated Local Storage & Dummy User Seed</div>
        </div>
      </div>
    </div>
  );
}
