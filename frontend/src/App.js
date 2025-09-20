import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import Dashboard from './components/Dashboard';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          <header className="app-header">
            <h1>Great AI Agent 🚀</h1>
            <div>
              <span>Welcome, {user.username}!</span>
              <button onClick={signOut} className="signout-btn">Sign Out</button>
            </div>
          </header>
          <Dashboard user={user} />
        </div>
      )}
    </Authenticator>
  );
}

export default App;
