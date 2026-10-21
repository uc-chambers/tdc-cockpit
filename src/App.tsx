import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import PhoneDirectory from './pages/PhoneDirectory';
import Forklifts from './pages/Forklifts';
import Equipment from './pages/Equipment';
import Operations from './pages/Operations';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'employees': return <Employees />;
      case 'phones': return <PhoneDirectory />;
      case 'forklifts': return <Forklifts />;
      case 'equipment': return <Equipment />;
      case 'operations': return <Operations />;
      case 'notes': return <Notes />;
      case 'tasks': return <Tasks />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
