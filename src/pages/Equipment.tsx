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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <RadioIcon size={20} className="text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{radioCount}</p>
            <p className="text-xs text-gray-400">{t('radio')}</p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Monitor size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{computerCount}</p>
            <p className="text-xs text-gray-400">{t('computer')}</p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
            {equipment.length}
          </div>
          <div>
            <p className="text-2xl font-bold">{equipment.length}</p>
            <p className="text-xs text-gray-400">{t('total')}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1">
            {(['all', 'radio', 'computer'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  typeFilter === type ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {type === 'all' ? t('total') : type === 'radio' ? t('radio') : t('computer')}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> {t('addEquipment')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="text-left p-3 font-medium text-gray-400">{t('type')}</th>
                <th className="text-left p-3 font-medium text-gray-400">{t('brand')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden md:table-cell">{t('assignedOperator')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden lg:table-cell">{t('comments')}</th>
                <th className="text-left p-3 font-medium text-gray-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-8 text-gray-500">{t('noData')}</td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                        item.type === 'radio' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {item.type === 'radio' ? <RadioIcon size={10} /> : <Monitor size={10} />}
                        {item.type === 'radio' ? t('radio') : t('computer')}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{item.brand}</td>
                    <td className="p-3 hidden md:table-cell text-gray-300">{item.assignedOperator}</td>
                    <td className="p-3 hidden lg:table-cell text-gray-400 text-xs max-w-[200px] truncate">{item.comments}</td>
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
              <h3 className="font-semibold">{editingId ? t('editEquipment') : t('addEquipment')}</h3>
              <button onClick={resetForm} className="p-1 hover:bg-gray-700 rounded"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('type')} *</label>
                <select
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value as 'radio' | 'computer'})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="radio">{t('radio')}</option>
                  <option value="computer">{t('computer')}</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('brand')} *</label>
                <input type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('assignedOperator')}</label>
                <input type="text" value={form.assignedOperator} onChange={e => setForm({...form, assignedOperator: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('comments')}</label>
                <textarea value={form.comments} onChange={e => setForm({...form, comments: e.target.value})} rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" />
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
