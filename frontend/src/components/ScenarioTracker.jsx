import React from 'react';
import { CheckCircle2, Circle, ListOrdered } from 'lucide-react';

export default function ScenarioTracker({ scenarios, onToggleScenario }) {
  return (
    <div className="card" style={{ background: '#0d1322', borderColor: 'var(--border-highlight)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 className="card-title" style={{ fontSize: '1.05rem', margin: 0 }}>
          <ListOrdered size={18} style={{ color: '#06b6d4' }} />
          Guided Lab Scenarios & Progress Checklist
        </h3>
        <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
          {scenarios.filter(s => s.completed).length} / {scenarios.length} Completed
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            onClick={() => onToggleScenario(sc.id)}
            style={{
              background: sc.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${sc.completed ? 'var(--color-secure-border)' : 'var(--border-color)'}`,
              borderRadius: '8px',
              padding: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              transition: 'all 0.2s ease'
            }}
          >
            {sc.completed ? (
              <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <Circle size={18} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: sc.completed ? '#fff' : 'var(--text-muted)' }}>
                Scenario {sc.id}: {sc.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                {sc.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
