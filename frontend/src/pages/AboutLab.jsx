import React from 'react';
import { HelpCircle, Users, BookOpen, ShieldCheck } from 'lucide-react';

export default function AboutLab() {
  const teamMembers = [
    {
      role: "Team Member 1",
      topic: "Introduction & Vulnerable SQL Mechanics",
      notes: "Explain that SQL Injection occurs when untrusted user input is directly concatenated into SQL strings. Demonstrate input like admin' -- altering query logic."
    },
    {
      role: "Team Member 2",
      topic: "Parameterized Queries (Prepared Statements)",
      notes: "Explain that parameter binding separates SQL query compilation from data values. SQLite ? placeholders ensure input is treated strictly as a literal data string."
    },
    {
      role: "Team Member 3",
      topic: "SQLAlchemy ORM Framework",
      notes: "Explain how ORMs abstract database tables as Python objects. ORM query filters like .filter() automatically construct parameterized queries under the hood."
    },
    {
      role: "Team Member 4",
      topic: "Input Validation & Defense in Depth",
      notes: "Explain Pydantic regex and length rules. Clarify that validation is a perimeter defense (defense in depth), while parameter binding remains the primary DB defense."
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <HelpCircle size={32} style={{ color: '#06b6d4' }} />
          About This Lab & Presentation Notes
        </h1>
        <p className="page-subtitle">
          Academic project objectives, tech stack architecture, and faculty presentation guides.
        </p>
      </div>

      <div className="card">
        <h2 className="card-title">
          <BookOpen size={20} style={{ color: '#10b981' }} /> Project Objective
        </h2>
        <p style={{ color: '#d1d5db', fontSize: '0.92rem', lineHeight: 1.6 }}>
          This cybersecurity laboratory project provides an interactive training playground demonstrating 
          <strong> SQL Injection (SQLi) vulnerabilities</strong> and <strong> three core defense mechanisms</strong>: 
          Parameterized Queries, ORM Frameworks, and Input Validation. The application operates 100% locally on an 
          isolated SQLite database using fictional dummy data.
        </p>
      </div>

      <div className="card">
        <h2 className="card-title">
          <Users size={20} style={{ color: '#06b6d4' }} /> Team Member Presentation Roles
        </h2>
        <div className="team-grid" style={{ marginTop: '1rem' }}>
          {teamMembers.map((m, i) => (
            <div key={i} className="team-card">
              <div className="team-role">{m.role}</div>
              <div className="team-topic">{m.topic}</div>
              <div className="team-notes">
                <strong>Key Points:</strong> {m.notes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
