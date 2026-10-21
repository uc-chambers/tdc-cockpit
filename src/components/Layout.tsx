import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Users, Phone, Truck, Radio, ClipboardList,
  Menu, X, Globe, LogOut, StickyNote, ListTodo, Sun, Moon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('taskCockpit') },
    { id: 'employees', icon: Users, label: t('employees') },
    { id: 'phones', icon: Phone, label: t('phoneDirectory') },
    { id: 'forklifts', icon: Truck, label: t('forklifts') },
    { id: 'equipment', icon: Radio, label: t('equipment') },
    { id: 'operations', icon: ClipboardList, label: t('operations') },
    { id: 'notes', icon: StickyNote, label: t('quickNotes') },
    { id: 'tasks', icon: ListTodo, label: t('tasks') },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        sidebar fixed lg:static inset-y-0 left-0 z-40
        w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-color)' }}>
          <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center font-bold text-white text-lg shadow-lg">
            T
          </div>
          <div>
            <h1 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>TDC Cockpit</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Operations Hub</p>
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
                className={`nav-item w-full flex items-center gap-3 ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-opacity-80"
            style={{ 
              backgroundColor: 'var(--bg-surface-secondary)',
              color: 'var(--text-secondary)'
            }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span className="flex-1 text-left">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-opacity-80"
            style={{ 
              backgroundColor: 'var(--bg-surface-secondary)',
              color: 'var(--text-secondary)'
            }}
          >
            <Globe size={16} />
            <span className="flex-1 text-left">{language === 'en' ? 'English' : 'Español'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
              backgroundColor: 'rgba(93, 169, 246, 0.1)',
              color: 'var(--accent)'
            }}>
              {language === 'en' ? 'ES' : 'EN'}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
            style={{ color: 'var(--text-secondary)' }}
          >
            <LogOut size={16} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header 
          className="h-16 flex items-center justify-between px-4 lg:px-6 shrink-0 border-b"
          style={{ 
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)'
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Menu size={20} />
          </button>
          <h2 className="text-lg font-semibold hidden lg:block" style={{ color: 'var(--text-primary)' }}>
            {navItems.find(n => n.id === currentPage)?.label}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
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
