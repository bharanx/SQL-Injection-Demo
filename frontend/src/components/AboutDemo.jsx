import React from 'react';
import { HelpCircle, Users, ListOrdered, Award, BookOpen } from 'lucide-react';

export default function AboutDemo() {
  const teamMembers = [
    {
      role: "Team Member 1",
      topic: "Introduction & SQL Injection Vulnerability",
      notes: "Explain that SQL Injection occurs when untrusted user input is directly concatenated into SQL strings. Demonstrate input like admin' -- altering the query logic."
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
          Faculty Demonstration Guide & Lab Overview
        </h1>
        <p className="page-subtitle">
          Structured presentation guide, speaking notes, and academic lab objectives.
        </p>
      </div>

      {/* Lab Objective Card */}
      <div className="card">
        <h2 className="card-title">
          <BookOpen size={20} style={{ color: '#10b981' }} />
          Academic Project Objective
        </h2>
        <p style={{ color: '#d1d5db', fontSize: '0.92rem', lineHeight: 1.6 }}>
          This cybersecurity laboratory project provides a practical, visual demonstration of 
          <strong> SQL Injection (SQLi) vulnerabilities</strong> and the <strong> three core defense mechanisms</strong>: 
          Parameterized Queries, ORM Frameworks, and Input Validation. The application runs 100% locally using safe dummy data 
          to provide an academic evaluation environment suitable for live classroom demonstration.
        </p>
      </div>

      {/* Team Speaking Notes Grid */}
      <div className="card">
        <h2 className="card-title">
          <Users size={20} style={{ color: '#06b6d4' }} />
          Team Member Presentation Roles & Speaking Notes (30–60s each)
        </h2>
        <div className="team-grid" style={{ marginTop: '1rem' }}>
          {teamMembers.map((member, i) => (
            <div key={i} className="team-card">
              <div className="team-role">{member.role}</div>
              <div className="team-topic">{member.topic}</div>
              <div className="team-notes">
                <strong>Key Points:</strong> {member.notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10-Step Presentation Sequence */}
      <div className="card">
        <h2 className="card-title">
          <ListOrdered size={20} style={{ color: '#f59e0b' }} />
          10-Step Demonstration Sequence for Faculty Review
        </h2>
        <ol style={{ paddingLeft: '1.2rem', color: '#d1d5db', fontSize: '0.88rem', lineHeight: 1.8 }}>
          <li><strong>Step 1:</strong> Start backend server (<code>python -m uvicorn main:app --reload</code>).</li>
          <li><strong>Step 2:</strong> Start frontend dashboard (<code>npm run dev</code>).</li>
          <li><strong>Step 3:</strong> Open Dashboard Overview and highlight 4 technique status cards.</li>
          <li><strong>Step 4:</strong> Explain SQL Injection vulnerability mechanics and risk.</li>
          <li><strong>Step 5:</strong> Run harmless test payload <code>admin' --</code> against Vulnerable endpoint (observe bypass).</li>
          <li><strong>Step 6:</strong> Run identical payload against Parameterized endpoint (observe SQLi prevented).</li>
          <li><strong>Step 7:</strong> Run payload against SQLAlchemy ORM endpoint (observe automated parameterization).</li>
          <li><strong>Step 8:</strong> Test malformed input on Input Validation tab (observe perimeter blocking).</li>
          <li><strong>Step 9:</strong> Review the Side-by-Side Security Comparison Matrix.</li>
          <li><strong>Step 10:</strong> Conclude by emphasizing defense in depth and parameterization as primary defense.</li>
        </ol>
      </div>
    </div>
  );
}
