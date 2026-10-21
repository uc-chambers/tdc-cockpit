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
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> {t('addContact')}
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center p-12 text-gray-500">{t('noData')}</div>
        ) : (
          filtered.map(contact => (
            <div key={contact.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                  {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(contact)} className="p-1.5 hover:bg-gray-700 rounded text-blue-400"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(contact.id)} className="p-1.5 hover:bg-gray-700 rounded text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1">{contact.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{contact.position} • {contact.department}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Phone size={12} className="text-green-400" />
                  <span>{contact.phone}</span>
                  {contact.extension && <span className="text-gray-500">Ext. {contact.extension}</span>}
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Mail size={12} className="text-blue-400" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="font-semibold">{editingId ? t('editContact') : t('addContact')}</h3>
              <button onClick={resetForm} className="p-1 hover:bg-gray-700 rounded"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('name')} *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('phone')} *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('extension')}</label>
                  <input type="text" value={form.extension} onChange={e => setForm({...form, extension: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('department')}</label>
                  <input type="text" value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('position')}</label>
                  <input type="text" value={form.position} onChange={e => setForm({...form, position: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('email')}</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex gap-2 p-4 border-t border-gray-700">
              <button onClick={resetForm} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">{t('cancel')}</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">{t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
