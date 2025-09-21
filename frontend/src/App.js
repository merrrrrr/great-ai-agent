import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import CampaignForm from './components/CampaignForm';
import CampaignHistory from './components/CampaignHistory';
import BackendTest from './components/BackendTest';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Demo User' }); // Mock auth

  return (
    <div className="App">
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
      </main>
    </div>
  );
}

export default App;