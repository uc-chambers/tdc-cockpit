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

  // Auto-hide completed tasks after 3 seconds
  useEffect(() => {
    const completedTasks = tasks.filter(t => t.completed && t.completedAt);
    if (completedTasks.length > 0) {
      const timers = completedTasks.map(task => {
        const elapsed = Date.now() - new Date(task.completedAt!).getTime();
        const remaining = Math.max(0, 3000 - elapsed);
        return setTimeout(() => {
          // Task will be hidden from pending view automatically
        }, remaining);
      });
      return () => timers.forEach(clearTimeout);
    }
  }, [tasks]);

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
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
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ListTodo size={20} className="text-blue-400" />
            {t('tasks')}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {pendingTasks.length} {t('pendingTasks').toLowerCase()}
            {completedTasks.length > 0 && ` • ${completedTasks.length} ${t('completedTasks').toLowerCase()}`}
          </p>
        </div>
        <div className="flex gap-2">
          {completedTasks.length > 0 && (
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              <CheckCircle2 size={14} className="text-green-400" />
              <span>{completedTasks.length}</span>
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> {t('addTask')}
          </button>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="space-y-2">
        {pendingTasks.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <CheckCircle2 size={40} className="mx-auto text-green-500 mb-3" />
            <p className="text-gray-400 font-medium">{t('noPendingTasks')}</p>
          </div>
        ) : (
          pendingTasks.map(task => (
            <div
              key={task.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all group"
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => handleComplete(task.id)}
                  className="mt-0.5 p-1 hover:bg-gray-700 rounded-lg transition-colors shrink-0"
                >
                  <Circle size={20} className="text-gray-400 hover:text-blue-400" />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-white">{task.title}</h3>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Priority badge */}
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)}
                      {t(task.priority as any)}
                    </span>
                    {/* Due date */}
                    {task.dueDate && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
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

      {/* Completed Tasks (collapsible) */}
      {showCompleted && completedTasks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2 mt-6">
            <CheckCircle2 size={14} className="text-green-400" />
            {t('completedTasks')} ({completedTasks.length})
          </h3>
          {completedTasks.map(task => (
            <div
              key={task.id}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 opacity-60"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleComplete(task.id)}
                  className="mt-0.5 p-1 hover:bg-gray-700 rounded-lg transition-colors shrink-0"
                >
                  <CheckCircle2 size={20} className="text-green-400" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-gray-400 line-through">{task.title}</h3>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)} opacity-50`}>
                      {getPriorityIcon(task.priority)}
                      {t(task.priority as any)}
                    </span>
                    {task.completedAt && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="font-semibold flex items-center gap-2">
                <ListTodo size={18} className="text-blue-400" />
                {t('addTask')}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-700 rounded"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Task *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="What needs to be done?"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('priority')}</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({...form, priority: e.target.value as any})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="high">{t('high')}</option>
                    <option value="medium">{t('medium')}</option>
                    <option value="low">{t('low')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('dueDate')}</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm({...form, dueDate: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-4 border-t border-gray-700">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">{t('cancel')}</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">{t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
