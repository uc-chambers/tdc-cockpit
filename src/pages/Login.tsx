import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Lock, Eye, EyeOff, LogIn, AlertCircle, Sun, Moon } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setError(true);
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20" style={{ background: 'var(--gradient-blue)' }}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20" style={{ background: 'var(--gradient-purple)' }}></div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg transition-all z-10"
        style={{ 
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)'
        }}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div 
          className="rounded-2xl p-8"
          style={{ 
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-blue flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">T</span>
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome Uriel</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>TDC Cockpit • Operations Hub</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(false); }}
                  placeholder="••••••••"
                  className={`input-field w-full pl-10 pr-10 py-3 ${error ? 'border-red-500' : ''}`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: '#EF4444' }}>
                  <AlertCircle size={12} />
                  <span>Invalid password. Please try again.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Troup Distribution Center
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          Secure Access • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
