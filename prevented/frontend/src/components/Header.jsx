import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="top-header">
      <div className="header-title">
        <img src="/logo.jpg" alt="Logo" className="header-logo" />
        SIIT Portal
      </div>
      <div className="header-user">
        <span className="user-role">{user.role}</span>
        <span>{user.profile.name}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </header>
  );
};

export default Header;
