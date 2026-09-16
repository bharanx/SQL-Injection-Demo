import React from 'react';
import { Shield } from 'lucide-react';

export default function TopBanner() {
  return (
    <div className="top-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Shield size={16} />
        <span>Educational Lab Environment</span>
        <span className="banner-pill">Local Testing Only</span>
        <span>• Faculty Demonstration & Student Learning Mode</span>
      </div>
    </div>
  );
}
