import React, { useState } from 'react';
import { GraduationCap, BookOpen, CheckCircle, HelpCircle, Code, User, Play, ChevronDown, ChevronUp } from 'lucide-react';

export default function ExamLabMode() {
  const [activeMember, setActiveMember] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);

  const teamRoles = [
    {
      id: 1,
      name: "Team Member 1",
      topic: "Introduction & SQL Injection Vulnerability",
      demoAction: "Show Vulnerable Endpoint with admin' --",
      script: "Good morning Professor. I am explaining SQL Injection vulnerability mechanics. In raw string concatenation, input like admin' -- modifies the SQL query AST structure. The single quote breaks out of string context, and the double dash comments out the password verification clause.",
      keyPoints: [
        "Concatenation merges code and data into a single string.",
        "Input single quotes (') alter the database SQL parser AST.",
        "Comment sequence (--) truncates trailing SQL logic."
      ]
    },
    {
      id: 2,
      name: "Team Member 2",
      topic: "Parameterized Queries (Prepared Statements)",
      demoAction: "Show Parameterized Endpoint with admin' --",
      script: "I am demonstrating Parameterized Queries (Prepared Statements). The query template SELECT ... WHERE username = ? is pre-compiled by SQLite. When user input is bound, SQLite treats admin' -- strictly as a literal data value, returning 0 records.",
      keyPoints: [
        "SQL template is compiled BEFORE data is bound.",
        "Placeholders (?) enforce code and data separation.",
        "User input characters are never evaluated as SQL syntax."
      ]
    },
    {
      id: 3,
      name: "Team Member 3",
      topic: "SQLAlchemy ORM Framework",
      demoAction: "Show ORM Query filter(User.username == username)",
      script: "I am presenting SQLAlchemy ORM framework abstraction. ORM filter expressions construct parameterized queries automatically. Developers write Python object queries instead of building raw SQL strings.",
      keyPoints: [
        "Maps database tables directly to Python classes.",
        "filter() methods construct bound parameter queries under the hood.",
        "Developers avoid manual SQL string formatting errors."
      ]
    },
    {
      id: 4,
      name: "Team Member 4",
      topic: "Input Validation & Defense in Depth",
      demoAction: "Show Pydantic Regex Validation Endpoint",
      script: "I am demonstrating Input Validation using Pydantic schemas. Regex rules allow only 3-30 alphanumeric characters, rejecting single quotes at the perimeter before any database query runs. This acts as Defense in Depth.",
      keyPoints: [
        "Perimeter validation stops malformed characters early.",
        "Input validation is Defense in Depth (Additional Layer).",
        "Parameterized queries remain the mandatory primary defense."
      ]
    }
  ];

  const vivaQuestions = [
    {
      q: "Q1: Why does string concatenation cause SQL Injection?",
      a: "Because the database parser receives a single formatted string combining SQL commands and user inputs. Input containing single quotes or comments modifies the query's Abstract Syntax Tree (AST), executing user input as SQL code."
    },
    {
      q: "Q2: What is the exact mechanism of a Prepared Statement?",
      a: "A prepared statement pre-compiles the SQL command template with placeholders (e.g. ?). The database engine compiles the command structure first, and then binds user input strictly as literal data values. The input cannot alter the compiled command tree."
    },
    {
      q: "Q3: Can an application using an ORM still be vulnerable to SQL Injection?",
      a: "Yes. While standard ORM query methods (like filter() or filter_by()) use parameter binding automatically, developers who pass manually concatenated strings into raw SQL execution helpers (e.g. db.execute(text(f'...')) will re-introduce SQL Injection vulnerabilities."
    },
    {
      q: "Q4: Why is input validation considered 'Defense in Depth' rather than the primary defense?",
      a: "Input validation restricts inputs at the perimeter, but complex validation rules can be bypassed or fail to anticipate all injection patterns. Furthermore, legitimate data may contain apostrophes (e.g. O'Connor). Therefore, parameterized queries must always serve as the primary database defense."
    },
    {
      q: "Q5: What is the difference between a SQL Injection Tautology and Comment Truncation?",
      a: "A Tautology payload (e.g. ' OR '1'='1) injects an always-true condition into the WHERE clause, forcing the query to return all records. A Comment Truncation payload (e.g. admin' --) uses database comment symbols to drop remaining constraints like password checks."
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <GraduationCap size={32} style={{ color: '#06b6d4' }} />
          Lab Examination & Faculty Viva Prep Mode
        </h1>
        <p className="page-subtitle">
          Interactive presentation guide, team member cue cards, and top viva examination Q&As.
        </p>
      </div>

      {/* Team Member Role Selector */}
      <div className="card">
        <h2 className="card-title">
          <User size={20} style={{ color: '#10b981' }} />
          Select Team Member Presentation Role
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {teamRoles.map((m) => (
            <button
              key={m.id}
              className={`btn ${activeMember === m.id ? 'btn-secure' : 'btn-secondary'}`}
              onClick={() => setActiveMember(m.id)}
            >
              {m.name} ({m.topic.split(' ')[0]})
            </button>
          ))}
        </div>

        {/* Selected Member Cue Card */}
        {(() => {
          const current = teamRoles.find(t => t.id === activeMember);
          return (
            <div style={{ background: '#090d16', border: '1px solid var(--color-cyan-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-cyan">{current.name} Presentation Card</span>
                <span className="badge badge-warning">Lab Exam Cue</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
                Topic: {current.topic}
              </h3>
              
              <div style={{ margin: '0.75rem 0', padding: '0.85rem', background: 'rgba(6, 182, 212, 0.1)', borderLeft: '4px solid #06b6d4', borderRadius: '6px' }}>
                <strong style={{ color: '#67e8f9', fontSize: '0.85rem' }}>🎯 EXACT SPOKEN SCRIPT FOR FACULTY DEMO:</strong>
                <p style={{ color: '#e5e7eb', fontSize: '0.92rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                  "{current.script}"
                </p>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                <strong style={{ color: '#10b981', fontSize: '0.85rem' }}>KEY TECHNICAL POINTS TO HIGHLIGHT:</strong>
                <ul style={{ paddingLeft: '1.2rem', color: '#d1d5db', fontSize: '0.88rem', marginTop: '0.35rem' }}>
                  {current.keyPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Top Viva Examination Questions */}
      <div className="card">
        <h2 className="card-title">
          <BookOpen size={20} style={{ color: '#f59e0b' }} />
          Faculty Viva Examination Q&A Flashcards
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Click any question to reveal the ideal concise answer for your lab examination viva:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {vivaQuestions.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#090d16',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    color: '#fff',
                    fontSize: '0.92rem'
                  }}
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                {isOpen && (
                  <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-color)', color: '#d1d5db', fontSize: '0.88rem', lineHeight: 1.6, background: 'rgba(255, 255, 255, 0.02)' }}>
                    <strong style={{ color: '#10b981' }}>ANSWER FOR VIVA: </strong>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
