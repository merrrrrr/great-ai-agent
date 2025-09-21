import React from 'react';
import './Navigation.css';

const Navigation = ({ currentPage, onNavigate, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'create', label: 'Create Campaign', icon: '✨' },
    { id: 'history', label: 'History', icon: '📋' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1 className="nav-title">Great AI Agent</h1>
      </div>
      
      <div className="nav-tabs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-tab ${currentPage === item.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="nav-user">
        <span className="user-name">Welcome, {user.username}</span>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;