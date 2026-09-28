import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const role = user.role;

  const studentLinks = [
    { to: "/student/dashboard", label: "Dashboard" },
    { to: "/student/profile", label: "My Profile" },
    { to: "/student/results", label: "Results" },
    { to: "/student/attendance", label: "Attendance" },
    { to: "/student/subjects", label: "Subjects" },
    { to: "/student/notices", label: "Notices" },

  ];

  const teacherLinks = [
    { to: "/teacher/dashboard", label: "Dashboard" },
    { to: "/teacher/students", label: "Students" },
    { to: "/teacher/marks", label: "Marks" },
    { to: "/teacher/attendance", label: "Attendance" },
    { to: "/teacher/subjects", label: "Subjects" },
    { to: "/teacher/notices", label: "Notices" },
    { to: "/teacher/blood-drive", label: "Blood Drive" },
    { to: "/teacher/profile", label: "My Profile" },

  ];

  const links = role === 'student' ? studentLinks : teacherLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        SIIT <span className="accent">ERP</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
