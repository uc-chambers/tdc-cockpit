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
          <Plus size={16} /> {t('addForklift')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="text-left p-3 font-medium text-gray-400">{t('brand')}</th>
                <th className="text-left p-3 font-medium text-gray-400">{t('truckId')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden md:table-cell">{t('serialNumber')}</th>
                <th className="text-left p-3 font-medium text-gray-400">{t('assignedOperator')}</th>
                <th className="text-left p-3 font-medium text-gray-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-8 text-gray-500">{t('noData')}</td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="p-3 font-medium">{item.brand}</td>
                    <td className="p-3">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs font-mono">{item.truckId}</span>
                    </td>
                    <td className="p-3 hidden md:table-cell text-gray-300 font-mono text-xs">{item.serialNumber}</td>
                    <td className="p-3 text-gray-300">{item.assignedOperator}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-gray-600 rounded text-blue-400"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-gray-600 rounded text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="font-semibold">{editingId ? t('editForklift') : t('addForklift')}</h3>
              <button onClick={resetForm} className="p-1 hover:bg-gray-700 rounded"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('brand')}</label>
                  <input type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('truckId')} *</label>
                  <input type="text" value={form.truckId} onChange={e => setForm({...form, truckId: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('serialNumber')}</label>
                <input type="text" value={form.serialNumber} onChange={e => setForm({...form, serialNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('assignedOperator')}</label>
                <input type="text" value={form.assignedOperator} onChange={e => setForm({...form, assignedOperator: e.target.value})}
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
