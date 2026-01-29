import React, { useState } from 'react';
import { Quiz } from './components/Quiz';
import { SalesPage } from './components/SalesPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const [view, setView] = useState<'quiz' | 'sales' | 'dashboard'>('quiz');
  const [userName, setUserName] = useState<string>('');

  const handleQuizComplete = (name: string) => {
    setUserName(name);
    // Smooth scroll to top when switching views
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView('sales');
  };

  const handleDashboardRequest = () => {
    setView('dashboard');
  };

  return (
    <div className="antialiased">
      {view === 'quiz' && (
        <Quiz 
          onComplete={handleQuizComplete} 
          onDashboardRequest={handleDashboardRequest}
        />
      )}
      {view === 'sales' && (
        <SalesPage userName={userName} />
      )}
      {view === 'dashboard' && (
        <Dashboard onBack={() => setView('quiz')} />
      )}
    </div>
  );
}

export default App;