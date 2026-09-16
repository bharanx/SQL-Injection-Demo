import React from 'react';
import { Database, ShieldCheck, Code, CheckCircle } from 'lucide-react';

export default function ORMDemo() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Database size={32} style={{ color: '#06b6d4' }} />
          SQLAlchemy ORM Framework Implementation
        </h1>
        <p className="page-subtitle">
          High-level object-relational mapping with automated query parameterization.
        </p>
      </div>

      <div className="card">
        <h2 className="card-title">What is an ORM (Object-Relational Mapper)?</h2>
        <p style={{ color: '#d1d5db', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.6 }}>
          An Object-Relational Mapper (ORM) allows developers to map database tables directly to programming language classes. 
          Instead of manually composing SQL strings, developers interact with database records using standard Python objects.
        </p>
      </div>

      {/* Code snippets requested by prompt */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ color: '#06b6d4', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={18} /> 1. ORM Model Definition (models.py)
          </div>
          <pre className="code-block">
            <code>
              <span className="keyword">class</span> <span className="sql-keyword">User</span>(Base):{"\n"}
              {"    "}<span className="string">__tablename__</span> = <span className="string">"users"</span>{"\n\n"}
              {"    "}id = Column(Integer, primary_key=<span className="keyword">True</span>){"\n"}
              {"    "}username = Column(String(50), unique=<span className="keyword">True</span>){"\n"}
              {"    "}password = Column(String(100), nullable=<span className="keyword">False</span>){"\n"}
              {"    "}email = Column(String(100)){"\n"}
              {"    "}role = Column(String(20))
            </code>
          </pre>
        </div>

        <div className="card">
          <div style={{ color: '#10b981', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> 2. Secure ORM Query Execution
          </div>
          <pre className="code-block">
            <code>
              <span className="comment"># Safe: SQLAlchemy generates parameterized SQL</span>{"\n"}
              user = db.query(User).filter({" \n"}
              {"    "}User.username == username,{"\n"}
              {"    "}User.password == password{"\n"}
              ).first()
            </code>
          </pre>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">
          <ShieldCheck size={20} style={{ color: '#10b981' }} />
          Why ORM Query Expressions Avoid SQL Injection
        </h3>
        <ul style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.7, paddingLeft: '1.2rem' }}>
          <li>
            <strong>Elimination of Manual Concatenation:</strong> Developers do not construct SQL strings by hand, avoiding string formatting errors.
          </li>
          <li>
            <strong>Automatic Prepared Statements:</strong> When <code>User.username == username</code> is evaluated, SQLAlchemy generates a bound SQL statement:
            <br />
            <code>SELECT users.id, users.username FROM users WHERE users.username = ? AND users.password = ?</code>
          </li>
          <li>
            <strong>Type Safety:</strong> Input types are converted according to column definitions before execution.
          </li>
        </ul>
      </div>
    </div>
  );
}
