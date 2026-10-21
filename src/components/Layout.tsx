import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Users, Phone, Truck, Radio, ClipboardList,
  Menu, Globe, LogOut, Lock, StickyNote, ListTodo, Sun, Moon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();
  const { logout, lock } = useAuth();
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
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        sidebar fixed lg:static inset-y-0 left-0 z-40
        w-[260px] transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-color)' }}>
          <div className="w-9 h-9 rounded-lg gradient-blue flex items-center justify-center font-bold text-white text-sm shadow-sm">
            T
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>TDC Cockpit</h1>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>Operations Hub</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={`nav-item w-full flex items-center gap-3 ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-3 border-t space-y-1" style={{ borderColor: 'var(--border-color)' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="nav-item w-full flex items-center gap-3"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span className="flex-1 text-left text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="nav-item w-full flex items-center gap-3"
          >
            <Globe size={18} />
            <span className="flex-1 text-left text-sm">{language === 'en' ? 'English' : 'Español'}</span>
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ 
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)'
            }}>
              {language === 'en' ? 'ES' : 'EN'}
            </span>
          </button>

          {/* Lock Session */}
          <button
            onClick={lock}
            className="nav-item w-full flex items-center gap-3 hover:!text-amber-500 hover:!bg-amber-50 dark:hover:!bg-amber-900/20"
          >
            <Lock size={18} />
            <span className="text-sm">{t('lockSession')}</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="nav-item w-full flex items-center gap-3 hover:!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20"
          >
            <LogOut size={18} />
            <span className="text-sm">{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="glass-header h-14 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Menu size={20} />
          </button>
          <h2 className="text-subheading hidden lg:block" style={{ color: 'var(--text-primary)' }}>
            {navItems.find(n => n.id === currentPage)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-caption hidden sm:block" style={{ color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'es-MX', {
                weekday: 'short', month: 'short', day: 'numeric'
              })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="glass-footer px-4 lg:px-6 py-3 shrink-0">
          <p className="text-caption text-center" style={{ color: 'var(--text-muted)' }}>
            Designed & Created by <span className="font-semibold" style={{ color: 'var(--accent)' }}>Uriel Ceballos</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
