import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData, Forklift } from '../context/DataContext';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Forklifts() {
  const { t } = useLanguage();
  const { forklifts, setForklifts } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Forklift, 'id'>>({
    brand: '', truckId: '', serialNumber: '', assignedOperator: ''
  });

  const filtered = forklifts.filter(f =>
    f.brand.toLowerCase().includes(search.toLowerCase()) ||
    f.truckId.toLowerCase().includes(search.toLowerCase()) ||
    f.assignedOperator.toLowerCase().includes(search.toLowerCase()) ||
    f.serialNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.truckId) return;
    if (editingId) {
      setForklifts(forklifts.map(f => f.id === editingId ? { ...form, id: editingId } : f));
    } else {
      setForklifts([...forklifts, { ...form, id: uuidv4() }]);
    }
    resetForm();
  };

  const handleEdit = (item: Forklift) => {
    setForm({ brand: item.brand, truckId: item.truckId, serialNumber: item.serialNumber, assignedOperator: item.assignedOperator });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setForklifts(forklifts.filter(f => f.id !== id));
  };

  const resetForm = () => {
    setForm({ brand: '', truckId: '', serialNumber: '', assignedOperator: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)}
            className="input-field w-full pl-9 pr-4" />
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> {t('addForklift')}
        </button>
      </div>

      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('brand')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('truckId')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{t('serialNumber')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('assignedOperator')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-12" style={{ color: 'var(--text-muted)' }}>{t('noData')}</td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="table-row">
                    <td className="p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{item.brand}</td>
                    <td className="p-4">
                      <span className="badge" style={{ backgroundColor: 'rgba(93, 169, 246, 0.1)', color: 'var(--accent)' }}>{item.truckId}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{item.serialNumber}</td>
                    <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{item.assignedOperator}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(item)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--accent)' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg transition-colors" style={{ color: '#EF4444' }}><Trash2 size={14} /></button>
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
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{editingId ? t('editForklift') : t('addForklift')}</h3>
              <button onClick={resetForm} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('brand')}</label>
                  <input type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('truckId')} *</label>
                  <input type="text" value={form.truckId} onChange={e => setForm({...form, truckId: e.target.value})} className="input-field w-full" />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('serialNumber')}</label>
                <input type="text" value={form.serialNumber} onChange={e => setForm({...form, serialNumber: e.target.value})} className="input-field w-full" />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('assignedOperator')}</label>
                <input type="text" value={form.assignedOperator} onChange={e => setForm({...form, assignedOperator: e.target.value})} className="input-field w-full" />
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
