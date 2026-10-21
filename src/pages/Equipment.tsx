import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData, EquipmentItem } from '../context/DataContext';
import { Plus, Search, Edit2, Trash2, X, Radio as RadioIcon, Monitor } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Equipment() {
  const { t } = useLanguage();
  const { equipment, setEquipment } = useData();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'radio' | 'computer'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<EquipmentItem, 'id'>>({
    type: 'radio', brand: '', assignedOperator: '', comments: ''
  });

  const filtered = equipment.filter(e => {
    const matchesSearch = e.brand.toLowerCase().includes(search.toLowerCase()) ||
      e.assignedOperator.toLowerCase().includes(search.toLowerCase()) ||
      e.comments.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const radioCount = equipment.filter(e => e.type === 'radio').length;
  const computerCount = equipment.filter(e => e.type === 'computer').length;

  const handleSave = () => {
    if (!form.brand) return;
    if (editingId) {
      setEquipment(equipment.map(e => e.id === editingId ? { ...form, id: editingId } : e));
    } else {
      setEquipment([...equipment, { ...form, id: uuidv4() }]);
    }
    resetForm();
  };

  const handleEdit = (item: EquipmentItem) => {
    setForm({ type: item.type, brand: item.brand, assignedOperator: item.assignedOperator, comments: item.comments });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
  };

  const resetForm = () => {
    setForm({ type: 'radio', brand: '', assignedOperator: '', comments: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-interactive p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)' }}>
            <RadioIcon size={20} style={{ color: '#06B6D4' }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{radioCount}</p>
            <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('radio')}</p>
          </div>
        </div>
        <div className="card card-interactive p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-light)' }}>
            <Monitor size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{computerCount}</p>
            <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('computer')}</p>
          </div>
        </div>
        <div className="card card-interactive p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
            <span className="text-base font-bold" style={{ color: '#8B5CF6' }}>{equipment.length}</span>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{equipment.length}</p>
            <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('total')}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)}
              className="input-field w-full pl-9 pr-4" />
          </div>
          <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
            {(['all', 'radio', 'computer'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  typeFilter === type ? 'shadow-sm' : ''
                }`}
                style={{
                  backgroundColor: typeFilter === type ? 'var(--bg-surface)' : 'transparent',
                  color: typeFilter === type ? 'var(--accent)' : 'var(--text-muted)',
                  border: typeFilter === type ? '1px solid var(--border-color)' : '1px solid transparent'
                }}
              >
                {type === 'all' ? t('total') : type === 'radio' ? t('radio') : t('computer')}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> {t('addEquipment')}
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-5 py-3.5 text-label" style={{ color: 'var(--text-muted)' }}>{t('type')}</th>
                <th className="text-left px-5 py-3.5 text-label" style={{ color: 'var(--text-muted)' }}>{t('brand')}</th>
                <th className="text-left px-5 py-3.5 text-label hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{t('assignedOperator')}</th>
                <th className="text-left px-5 py-3.5 text-label hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{t('comments')}</th>
                <th className="text-left px-5 py-3.5 text-label" style={{ color: 'var(--text-muted)' }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16" style={{ color: 'var(--text-muted)' }}>{t('noData')}</td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="table-row">
                    <td className="px-5 py-3.5">
                      <span className="badge" style={{
                        backgroundColor: item.type === 'radio' ? 'rgba(6, 182, 212, 0.1)' : 'var(--accent-light)',
                        color: item.type === 'radio' ? '#06B6D4' : 'var(--accent)'
                      }}>
                        {item.type === 'radio' ? <RadioIcon size={10} /> : <Monitor size={10} />}
                        {item.type === 'radio' ? t('radio') : t('computer')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium" style={{ color: 'var(--text-primary)' }}>{item.brand}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{item.assignedOperator}</td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-caption max-w-[200px] truncate" style={{ color: 'var(--text-muted)' }}>{item.comments}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-0.5">
                        <button onClick={() => handleEdit(item)} className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ color: 'var(--accent)' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20" style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4">
          <div className="modal-content w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{editingId ? t('editEquipment') : t('addEquipment')}</h3>
              <button onClick={resetForm} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('type')} *</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value as 'radio' | 'computer'})}
                  className="input-field w-full">
                  <option value="radio">{t('radio')}</option>
                  <option value="computer">{t('computer')}</option>
                </select>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('brand')} *</label>
                <input type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="input-field w-full" />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('assignedOperator')}</label>
                <input type="text" value={form.assignedOperator} onChange={e => setForm({...form, assignedOperator: e.target.value})} className="input-field w-full" />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('comments')}</label>
                <textarea value={form.comments} onChange={e => setForm({...form, comments: e.target.value})} rows={3}
                  className="input-field w-full resize-none" />
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
