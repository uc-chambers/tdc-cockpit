import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Trash2, X, StickyNote, Pin, Clock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
}

const COLORS = [
  'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  'from-green-500/20 to-green-600/10 border-green-500/30',
  'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  'from-pink-500/20 to-pink-600/10 border-pink-500/30',
  'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
];

function loadNotes(): Note[] {
  try {
    const saved = localStorage.getItem('cockpit-notes');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function Notes() {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', color: COLORS[0] });

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('cockpit-notes', JSON.stringify(newNotes));
  };

  const handleAdd = () => {
    if (!form.title && !form.content) return;
    const newNote: Note = {
      id: uuidv4(),
      title: form.title,
      content: form.content,
      color: form.color,
      pinned: false,
      createdAt: new Date().toISOString()
    };
    saveNotes([newNote, ...notes]);
    setForm({ title: '', content: '', color: COLORS[0] });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  const handlePin = (id: string) => {
    saveNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <StickyNote size={20} className="text-yellow-400" />
            {t('quickNotes')}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{notes.length} {t('notes').toLowerCase()}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> {t('addNote')}
        </button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <StickyNote size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500">{t('noData')}</p>
          <p className="text-xs text-gray-600 mt-1">Create your first note to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map(note => (
            <div
              key={note.id}
              className={`relative bg-gradient-to-br ${note.color} border rounded-xl p-4 hover:scale-[1.01] transition-transform`}
            >
              {/* Pin indicator */}
              {note.pinned && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Pin size={12} className="text-white" />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm text-white pr-6 flex-1">{note.title || 'Untitled'}</h3>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handlePin(note.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      note.pinned ? 'bg-yellow-500/30 text-yellow-300' : 'hover:bg-white/10 text-gray-400'
                    }`}
                  >
                    <Pin size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{note.content}</p>

              {/* Footer */}
              <div className="flex items-center gap-1 mt-3 pt-2 border-t border-white/10">
                <Clock size={10} className="text-gray-400" />
                <span className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
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
                <StickyNote size={18} className="text-yellow-400" />
                {t('addNote')}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-700 rounded"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="Note title..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  placeholder="Write your note here..."
                  rows={5}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setForm({...form, color})}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} border-2 transition-all ${
                        form.color === color ? 'border-white scale-110' : 'border-transparent hover:border-white/30'
                      }`}
                    />
                  ))}
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
