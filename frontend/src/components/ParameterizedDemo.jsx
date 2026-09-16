import React from 'react';
import { KeyRound, CheckCircle, XCircle, Code, ShieldAlert } from 'lucide-react';

export default function ParameterizedDemo() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <KeyRound size={32} style={{ color: '#10b981' }} />
          Parameterized Queries (Prepared Statements)
        </h1>
        <p className="page-subtitle">
          The Primary Defense Against SQL Injection Vulnerabilities
        </p>
      </div>

      <div className="card">
        <h2 className="card-title">What Are Parameterized Queries?</h2>
        <p style={{ color: '#d1d5db', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.6 }}>
          Parameterized queries (prepared statements) enforce a strict separation between 
          <strong> SQL code structure</strong> and <strong> user-supplied data values</strong>.
          Instead of interpolating untrusted input into the SQL command string, parameters are represented 
          by placeholders (such as <code>?</code> in SQLite or <code>%s</code> in PostgreSQL).
        </p>
      </div>

      {/* Code Comparison Requested by Prompt */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ borderColor: 'var(--color-vulnerable-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-vulnerable)', marginBottom: '0.75rem', fontWeight: 700 }}>
            <XCircle size={20} /> UNSAFE (String Concatenation)
          </div>
          <pre className="code-block">
            <code>
              <span className="comment"># Dangerous: User input directly added to query string</span>{"\n"}
              query = <span className="string">f"SELECT * FROM users WHERE username='&#123;username&#125;'"</span>
            </code>
          </pre>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <li>SQL parser compiles code and data together in a single pass.</li>
            <li>Single quotes in input alter SQL syntax tree (AST).</li>
            <li>Allows comment truncation (<code>--</code>) and tautologies (<code>' OR '1'='1</code>).</li>
          </ul>
        </div>

        <div className="card" style={{ borderColor: 'var(--color-secure-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secure)', marginBottom: '0.75rem', fontWeight: 700 }}>
            <CheckCircle size={20} /> SAFE (Parameterized Binding)
          </div>
          <pre className="code-block">
            <code>
              <span className="comment"># Secure: Placeholders separate structure from data</span>{"\n"}
              query = <span className="string">"SELECT * FROM users WHERE username=?"</span>{"\n"}
              cursor.<span className="sql-keyword">execute</span>(query, (username,))
            </code>
          </pre>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <li>SQL query template is pre-compiled by database engine first.</li>
            <li>Input values are bound strictly as data literals.</li>
            <li>Single quotes and SQL control keywords inside input are never parsed as code.</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">
          <ShieldAlert size={20} style={{ color: '#f59e0b' }} />
          Why Parameter Binding Works Under the Hood
        </h3>
        <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.6 }}>
          When SQLite receives <code>cursor.execute("SELECT * FROM users WHERE username=?", ("admin' --",))</code>, 
          the engine does not perform string concatenation. Instead, it instructs the storage engine to look for a record 
          whose <code>username</code> column exactly matches the string <code>"admin' --"</code> character-for-character. 
          Because no user has that literal username, 0 rows are returned and the database remains 100% secure.
        </p>
      </div>
    </div>
  );
}
