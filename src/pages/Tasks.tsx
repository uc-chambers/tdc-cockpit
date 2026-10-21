import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Trash2, X, CheckCircle2, Circle, ListTodo, Clock, AlertTriangle, Zap } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
}

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem('cockpit-tasks');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function Tasks() {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [showForm, setShowForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [form, setForm] = useState({ title: '', priority: 'medium' as 'high' | 'medium' | 'low', dueDate: '' });

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('cockpit-tasks', JSON.stringify(newTasks));
  };

  const handleAdd = () => {
    if (!form.title) return;
    const newTask: Task = {
      id: uuidv4(),
      title: form.title,
      priority: form.priority,
      dueDate: form.dueDate,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString()
    };
    saveTasks([newTask, ...tasks]);
    setForm({ title: '', priority: 'medium', dueDate: '' });
    setShowForm(false);
  };

  const handleComplete = (id: string) => {
    saveTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
        : task
    ));
  };

  const handleDelete = (id: string) => {
    saveTasks(tasks.filter(task => task.id !== id));
  };

  useEffect(() => {
    const completedTasks = tasks.filter(t => t.completed && t.completedAt);
    if (completedTasks.length > 0) {
      const timers = completedTasks.map(task => {
        const elapsed = Date.now() - new Date(task.completedAt!).getTime();
        const remaining = Math.max(0, 3000 - elapsed);
        return setTimeout(() => {}, remaining);
      });
      return () => timers.forEach(clearTimeout);
    }
  }, [tasks]);

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' };
      case 'medium': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' };
      case 'low': return { bg: 'rgba(53, 198, 200, 0.1)', text: '#35C6C8' };
      default: return { bg: 'var(--bg-surface-secondary)', text: 'var(--text-muted)' };
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle size={12} />;
      case 'medium': return <Zap size={12} />;
      case 'low': return <Circle size={12} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <ListTodo size={20} style={{ color: 'var(--accent)' }} />
            {t('tasks')}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {pendingTasks.length} {t('pendingTasks').toLowerCase()}
            {completedTasks.length > 0 && ` • ${completedTasks.length} ${t('completedTasks').toLowerCase()}`}
          </p>
        </div>
        <div className="flex gap-2">
          {completedTasks.length > 0 && (
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="btn-secondary flex items-center gap-2"
            >
              <CheckCircle2 size={14} style={{ color: '#35C6C8' }} />
              <span>{completedTasks.length}</span>
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> {t('addTask')}
          </button>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="space-y-2">
        {pendingTasks.length === 0 ? (
          <div className="card p-12 text-center">
            <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: '#35C6C8' }} />
            <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>{t('noPendingTasks')}</p>
          </div>
        ) : (
          pendingTasks.map(task => (
            <div
              key={task.id}
              className="card card-interactive p-4 group"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleComplete(task.id)}
                  className="mt-0.5 p-1 rounded-lg transition-colors shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Circle size={20} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{task.title}</h3>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="badge" style={{
                      backgroundColor: getPriorityColor(task.priority).bg,
                      color: getPriorityColor(task.priority).text
                    }}>
                      {getPriorityIcon(task.priority)}
                      {t(task.priority as any)}
                    </span>
                    {task.dueDate && (
                      <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={10} />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Tasks */}
      {showCompleted && completedTasks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2 mt-6" style={{ color: 'var(--text-muted)' }}>
            <CheckCircle2 size={14} style={{ color: '#35C6C8' }} />
            {t('completedTasks')} ({completedTasks.length})
          </h3>
          {completedTasks.map(task => (
            <div
              key={task.id}
              className="card p-4 opacity-60"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleComplete(task.id)}
                  className="mt-0.5 p-1 rounded-lg transition-colors shrink-0"
                  style={{ color: '#35C6C8' }}
                >
                  <CheckCircle2 size={20} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium line-through" style={{ color: 'var(--text-muted)' }}>{task.title}</h3>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="badge opacity-50" style={{
                      backgroundColor: getPriorityColor(task.priority).bg,
                      color: getPriorityColor(task.priority).text
                    }}>
                      {getPriorityIcon(task.priority)}
                      {t(task.priority as any)}
                    </span>
                    {task.completedAt && (
                      <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={10} />
                        {new Date(task.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4">
          <div className="modal-content w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <ListTodo size={18} style={{ color: 'var(--accent)' }} />
                {t('addTask')}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Task *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="What needs to be done?"
                  className="input-field w-full"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('priority')}</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({...form, priority: e.target.value as any})}
                    className="input-field w-full"
                  >
                    <option value="high">{t('high')}</option>
                    <option value="medium">{t('medium')}</option>
                    <option value="low">{t('low')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('dueDate')}</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm({...form, dueDate: e.target.value})}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">{t('cancel')}</button>
              <button onClick={handleAdd} className="btn-primary flex-1">{t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
