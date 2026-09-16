import React from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  KeyRound, 
  Database, 
  ShieldCheck, 
  GitCompare, 
  Network, 
  GraduationCap,
  HelpCircle 
} from 'lucide-react';

export default function SidebarNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'demo', label: 'SQL Injection Demo', icon: Terminal },
    { id: 'parameterized', label: 'Parameterized Queries', icon: KeyRound },
    { id: 'orm', label: 'SQLAlchemy ORM', icon: Database },
    { id: 'validation', label: 'Input Validation', icon: ShieldCheck },
    { id: 'comparison', label: 'Comparison Matrix', icon: GitCompare },
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'exam', label: 'Lab Exam & Viva Prep', icon: GraduationCap },
    { id: 'about', label: 'About & Demo Guide', icon: HelpCircle },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">SQLi</div>
        <div>
          <div className="brand-title">SQL Injection</div>
          <div className="brand-subtitle">Prevention Lab v1.0</div>
        </div>
      </div>

      <ul className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
