import React from 'react';
import { GitCompare, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';

export default function ComparisonTable() {
  const comparisonData = [
    {
      technique: "Unsafe String Concatenation",
      howItWorks: "Directly interpolates user input strings into raw SQL command text using f-strings or string formatting.",
      securityRole: "None. Merges SQL command structure with untrusted input data.",
      status: "Unsafe ❌",
      badgeClass: "badge-vulnerable"
    },
    {
      technique: "Parameterized Queries (Prepared Statements)",
      howItWorks: "Pre-compiles SQL query template and binds user inputs strictly as literal data values using placeholders (?).",
      securityRole: "PRIMARY SQL Injection Defense. Guarantees input cannot alter SQL syntax execution.",
      status: "Protected ✅",
      badgeClass: "badge-secure"
    },
    {
      technique: "SQLAlchemy ORM Framework",
      howItWorks: "Uses Python object-relational mapping methods (.filter()) which generate parameterized SQL queries automatically.",
      securityRole: "PRIMARY SQL Injection Defense (when using built-in ORM query methods safely).",
      status: "Protected ✅",
      badgeClass: "badge-secure"
    },
    {
      technique: "Input Validation (Pydantic / Regex)",
      howItWorks: "Validates input character sets, length boundaries, and formats before reaching the database engine.",
      securityRole: "Defense in Depth (Additional Layer). Blocks malformed payloads at the perimeter.",
      status: "Additional Layer 🛡️",
      badgeClass: "badge-warning"
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <GitCompare size={32} style={{ color: '#06b6d4' }} />
          Security Comparison Matrix
        </h1>
        <p className="page-subtitle">
          Side-by-side evaluation of vulnerable vs secure database query techniques.
        </p>
      </div>

      <div className="card">
        <h2 className="card-title">Technique Evaluation Summary</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Technique</th>
                <th>How It Works</th>
                <th>Security Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: '#fff', minWidth: '180px' }}>{row.technique}</td>
                  <td style={{ fontSize: '0.88rem', color: '#d1d5db', minWidth: '240px' }}>{row.howItWorks}</td>
                  <td style={{ fontSize: '0.88rem', color: '#9ca3af', minWidth: '220px' }}>{row.securityRole}</td>
                  <td style={{ minWidth: '120px' }}>
                    <span className={`badge ${row.badgeClass}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Developer Note */}
      <div className="card" style={{ borderColor: 'var(--color-warning-border)' }}>
        <h3 className="card-title" style={{ color: '#f59e0b' }}>
          <ShieldAlert size={20} />
          IMPORTANT: ORM Caveat & Developer Responsibility
        </h3>
        <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Do not assume that simply using an ORM makes an entire application automatically immune to SQL injection. 
          If developers bypass safe ORM methods and execute raw SQL strings via string concatenation inside ORM helpers 
          (e.g., <code>db.execute(text(f"SELECT * FROM users WHERE username='{username}'"))</code>), 
          the application will still be vulnerable to SQL injection. 
          <strong> Safe parameter binding must always be preserved.</strong>
        </p>
      </div>
    </div>
  );
}
