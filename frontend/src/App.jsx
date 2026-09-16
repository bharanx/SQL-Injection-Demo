import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import ScenarioTracker from './components/ScenarioTracker.jsx';

import HomeLanding from './pages/HomeLanding.jsx';
import LoginLab from './pages/LoginLab.jsx';
import SearchLab from './pages/SearchLab.jsx';
import ValidationLab from './pages/ValidationLab.jsx';
import QueryInspector from './pages/QueryInspector.jsx';
import AttackVsDefense from './pages/AttackVsDefense.jsx';
import DatabaseViewer from './pages/DatabaseViewer.jsx';
import AboutLab from './pages/AboutLab.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [scenarios, setScenarios] = useState([
    { id: 1, title: 'Test Vulnerable Login', desc: "Run admin' -- against vulnerable login endpoint", completed: false },
    { id: 2, title: 'Test Parameterized Login', desc: 'Run identical input against parameterized query', completed: false },
    { id: 3, title: 'Test ORM Login', desc: 'Run identical input against SQLAlchemy ORM filter', completed: false },
    { id: 4, title: 'Test Search Lab SQLi', desc: 'Run search query injection payload in directory', completed: false },
    { id: 5, title: 'Test Input Validation', desc: 'Verify perimeter rules block disallowed SQL characters', completed: false },
  ]);

  const handleScenarioComplete = (id) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, completed: true } : s));
  };

  const handleToggleScenario = (id) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const progressCount = scenarios.filter(s => s.completed).length;

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomeLanding setActiveTab={setActiveTab} />;
      case 'login':
        return <LoginLab onScenarioComplete={handleScenarioComplete} />;
      case 'search':
        return <SearchLab onScenarioComplete={handleScenarioComplete} />;
      case 'validation':
        return <ValidationLab onScenarioComplete={handleScenarioComplete} />;
      case 'inspector':
        return <QueryInspector />;
      case 'compare':
        return <AttackVsDefense />;
      case 'database':
        return <DatabaseViewer />;
      case 'about':
        return <AboutLab />;
      default:
        return <HomeLanding setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} progressCount={progressCount} />
      <div className="main-content" style={{ maxWidth: '1350px', margin: '0 auto' }}>
        {activeTab !== 'home' && activeTab !== 'about' && (
          <ScenarioTracker scenarios={scenarios} onToggleScenario={handleToggleScenario} />
        )}
        {renderActivePage()}
      </div>
    </div>
  );
}
