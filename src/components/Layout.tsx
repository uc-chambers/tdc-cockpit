import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard, Users, Phone, Truck, Radio, ClipboardList,
  Menu, X, Globe, ChevronDown
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'employees', icon: Users, label: t('employees') },
    { id: 'phones', icon: Phone, label: t('phoneDirectory') },
    { id: 'forklifts', icon: Truck, label: t('forklifts') },
    { id: 'equipment', icon: Radio, label: t('equipment') },
    { id: 'operations', icon: ClipboardList, label: t('operations') },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-gray-800 border-r border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
            W
          </div>
          <div>
            <h1 className="font-bold text-sm">Warehouse Cockpit</h1>
            <p className="text-xs text-gray-400">Operations Hub</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Language Switch */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg p-2">
            <Globe size={16} className="text-gray-400" />
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex-1 flex items-center justify-between text-sm"
            >
              <span className="text-gray-300">{language === 'en' ? 'English' : 'Español'}</span>
              <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded">
                {language === 'en' ? 'ES' : 'EN'}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-lg font-semibold hidden lg:block">
            {navItems.find(n => n.id === currentPage)?.label}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'es-MX', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
