import React from 'react';
import { Shield, Terminal, Database, KeyRound, ShieldCheck, GitCompare, Search, Lock, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, progressCount }) {
  const navItems = [
    { id: 'home', label: 'Playground', icon: Shield },
    { id: 'login', label: 'Login Lab', icon: Lock },
    { id: 'search', label: 'Search Lab', icon: Search },
    { id: 'validation', label: 'Input Validation', icon: ShieldCheck },
    { id: 'inspector', label: 'Query Inspector', icon: Terminal },
    { id: 'compare', label: 'Attack vs Defense', icon: GitCompare },
    { id: 'database', label: 'Database Viewer', icon: Database },
    { id: 'about', label: 'About', icon: HelpCircle },
  ];

  return (
    <nav style={{
      backgroundColor: '#0d1322',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
        <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
          SQL
        </div>
        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>SQL LAB</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Interactive Prevention Playground</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} style={{ color: isActive ? '#06b6d4' : 'inherit' }} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-secure-border)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
        <CheckCircle2 size={14} />
        <span>LAB PROGRESS: {progressCount}/5</span>
      </div>
    </nav>
  );
}
