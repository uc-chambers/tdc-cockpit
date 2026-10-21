import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData, PhoneContact } from '../context/DataContext';
import { Plus, Search, Edit2, Trash2, X, Phone, Mail } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function PhoneDirectory() {
  const { t } = useLanguage();
  const { phoneContacts, setPhoneContacts } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<PhoneContact, 'id'>>({
    name: '', phone: '', extension: '', department: '', position: '', email: ''
  });

  const filtered = phoneContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleSave = () => {
    if (!form.name) return;
    if (editingId) {
      setPhoneContacts(phoneContacts.map(c => c.id === editingId ? { ...form, id: editingId } : c));
    } else {
      setPhoneContacts([...phoneContacts, { ...form, id: uuidv4() }]);
    }
    resetForm();
  };

  const handleEdit = (contact: PhoneContact) => {
    setForm({ name: contact.name, phone: contact.phone, extension: contact.extension, department: contact.department, position: contact.position, email: contact.email });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPhoneContacts(phoneContacts.filter(c => c.id !== id));
  };

  const resetForm = () => {
    setForm({ name: '', phone: '', extension: '', department: '', position: '', email: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field w-full pl-9 pr-4"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> {t('addContact')}
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-20" style={{ color: 'var(--text-muted)' }}>{t('noData')}</div>
        ) : (
          filtered.map(contact => (
            <div key={contact.id} className="card card-interactive p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-purple-500/30">
                  {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(contact)} className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors" style={{ color: 'var(--accent)' }}><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(contact.id)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="text-body font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{contact.name}</h3>
              <p className="text-caption mb-4" style={{ color: 'var(--text-muted)' }}>{contact.position} • {contact.department}</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-caption" style={{ color: 'var(--text-secondary)' }}>
                  <Phone size={14} style={{ color: 'var(--success)' }} />
                  <span className="font-medium">{contact.phone}</span>
                  {contact.extension && <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>Ext. {contact.extension}</span>}
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2.5 text-caption" style={{ color: 'var(--text-secondary)' }}>
                    <Mail size={14} style={{ color: 'var(--accent)' }} />
                    <span className="truncate font-medium">{contact.email}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4">
          <div className="modal-content w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{editingId ? t('editContact') : t('addContact')}</h3>
              <button onClick={resetForm} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('name')} *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="input-field w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('phone')} *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('extension')}</label>
                  <input type="text" value={form.extension} onChange={e => setForm({...form, extension: e.target.value})}
                    className="input-field w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('department')}</label>
                  <input type="text" value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('position')}</label>
                  <input type="text" value={form.position} onChange={e => setForm({...form, position: e.target.value})}
                    className="input-field w-full" />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('email')}</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="input-field w-full" />
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button onClick={resetForm} className="btn-secondary flex-1">{t('cancel')}</button>
              <button onClick={handleSave} className="btn-primary flex-1">{t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
