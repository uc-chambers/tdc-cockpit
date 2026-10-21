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
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl" style={{ background: 'var(--gradient-blue)' }}></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl" style={{ background: 'var(--gradient-purple)' }}></div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="card absolute top-4 right-4 p-2.5 rounded-lg z-10"
        style={{ color: 'var(--text-secondary)' }}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="card rounded-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl gradient-blue flex items-center justify-center mb-5 shadow-md">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <h1 className="text-heading text-center mb-1.5" style={{ color: 'var(--text-primary)' }}>Welcome Uriel</h1>
            <p className="text-caption text-center" style={{ color: 'var(--text-muted)' }}>TDC Cockpit • Operations Hub</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-label mb-2 block" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(false); }}
                  placeholder="••••••••"
                  className={`input-field w-full pl-10 pr-10 py-2.5 ${error ? '!border-red-500' : ''}`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: 'var(--danger)' }}>
                  <AlertCircle size={12} />
                  <span>Invalid password. Please try again.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
              Troup Distribution Center
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          Secure Access • Authorized Personnel Only
        </p>

        {/* Creator credit */}
        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          Designed & Created by <span className="font-semibold" style={{ color: 'var(--accent)' }}>Uriel Ceballos</span>
        </p>
      </div>
    </div>
  );
}
