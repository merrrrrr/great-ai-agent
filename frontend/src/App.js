import React, { useState } from 'react';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CampaignForm from './components/CampaignForm';
import CampaignHistory from './components/CampaignHistory';
import BackendTest from './components/BackendTest';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="app-content">
        {currentPage === 'dashboard' && (
          <Dashboard user={user} onNavigate={handleNavigate} />
        )}
        {currentPage === 'create' && (
          <CampaignForm onNavigate={handleNavigate} />
        )}
        {currentPage === 'history' && (
          <CampaignHistory user={user} onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}

export default App;