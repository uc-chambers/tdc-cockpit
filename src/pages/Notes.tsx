import { useState } from 'react';
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
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <StickyNote size={20} style={{ color: '#F58AB5' }} />
            {t('quickNotes')}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{notes.length} {t('notes').toLowerCase()}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> {t('addNote')}
        </button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="card p-20 text-center">
          <StickyNote size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p className="text-body" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
          <p className="text-caption mt-2" style={{ color: 'var(--text-muted)' }}>Create your first note to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedNotes.map(note => (
            <div
              key={note.id}
              className={`card card-interactive relative p-6`}
              style={{
                background: note.color.includes('blue') ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.08))' :
                           note.color.includes('purple') ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(168, 85, 247, 0.08))' :
                           note.color.includes('green') ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.08))' :
                           note.color.includes('orange') ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(236, 72, 153, 0.08))' :
                           note.color.includes('pink') ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(244, 114, 182, 0.08))' :
                           'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(251, 191, 36, 0.08))'
              }}
            >
              {/* Pin indicator */}
              {note.pinned && (
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Pin size={13} className="text-white" />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-body font-bold pr-6 flex-1" style={{ color: 'var(--text-primary)' }}>{note.title || 'Untitled'}</h3>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handlePin(note.id)}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: note.pinned ? 'rgba(236, 72, 153, 0.15)' : 'transparent',
                      color: note.pinned ? '#EC4899' : 'var(--text-muted)'
                    }}
                  >
                    <Pin size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-2 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <p className="text-body whitespace-pre-wrap leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{note.content}</p>

              {/* Footer */}
              <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
                  {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4 animate-overlay-enter">
          <div className="modal-content w-full max-w-lg animate-modal-enter">
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <StickyNote size={18} style={{ color: '#F58AB5' }} />
                {t('addNote')}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="Note title..."
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  placeholder="Write your note here..."
                  rows={5}
                  className="input-field w-full resize-none"
                />
              </div>
              <div>
                <label className="text-xs mb-2 block" style={{ color: 'var(--text-secondary)' }}>Color</label>
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
