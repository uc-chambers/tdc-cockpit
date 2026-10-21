import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import PhoneDirectory from './pages/PhoneDirectory';
import Forklifts from './pages/Forklifts';
import Equipment from './pages/Equipment';
import Operations from './pages/Operations';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'employees': return <Employees />;
      case 'phones': return <PhoneDirectory />;
      case 'forklifts': return <Forklifts />;
      case 'equipment': return <Equipment />;
      case 'operations': return <Operations />;
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
      <DataProvider>
        <AppContent />
      </DataProvider>
    </LanguageProvider>
  );
}
