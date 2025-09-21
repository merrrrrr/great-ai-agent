import React, { useState } from 'react';
import Auth from './components/Auth';
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
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="App">
<<<<<<< HEAD
      <nav className="navbar">
        <h1>Great AI Agent</h1>
        <div className="nav-links">
          <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
          <button onClick={() => setCurrentView('create')}>Create Campaign</button>
          <button onClick={() => setCurrentView('history')}>History</button>
          <button onClick={() => setCurrentView('test')}>🔧 Test Backend</button>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
        {currentView === 'create' && <CampaignForm />}
        {currentView === 'history' && <CampaignHistory />}
        {currentView === 'test' && <BackendTest />}
=======
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
>>>>>>> 0d2d2b817a64f18068a9e5a1ce9706a6cb987c2e
      </main>
    </div>
  );
}

export default App;