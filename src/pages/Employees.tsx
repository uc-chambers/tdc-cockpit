import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData, Employee } from '../context/DataContext';
import { Plus, Search, Edit2, Trash2, X, UserPlus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Employees() {
  const { t } = useLanguage();
  const { employees, setEmployees } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Employee, 'id'>>({
    fullName: '', businessUnit: '', startDate: '', seniority: 0, role: '', age: 0, phone: ''
  });

  const filtered = employees.filter(e =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.businessUnit.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.fullName) return;
    if (editingId) {
      setEmployees(employees.map(e => e.id === editingId ? { ...form, id: editingId } : e));
    } else {
      setEmployees([...employees, { ...form, id: uuidv4() }]);
    }
    resetForm();
  };

  const handleEdit = (emp: Employee) => {
    setForm({ fullName: emp.fullName, businessUnit: emp.businessUnit, startDate: emp.startDate, seniority: emp.seniority, role: emp.role, age: emp.age, phone: emp.phone });
    setEditingId(emp.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const resetForm = () => {
    setForm({ fullName: '', businessUnit: '', startDate: '', seniority: 0, role: '', age: 0, phone: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const calcSeniority = (startDate: string) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
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
          <Plus size={16} /> {t('addEmployee')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="text-left p-3 font-medium text-gray-400">{t('fullName')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden md:table-cell">{t('businessUnit')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden lg:table-cell">{t('startDate')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden sm:table-cell">{t('seniority')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden lg:table-cell">{t('role')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden md:table-cell">{t('age')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden lg:table-cell">{t('phone')}</th>
                <th className="text-left p-3 font-medium text-gray-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center p-8 text-gray-500">{t('noData')}</td></tr>
              ) : (
                filtered.map(emp => (
                  <tr key={emp.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="p-3 font-medium">{emp.fullName}</td>
                    <td className="p-3 hidden md:table-cell text-gray-300">{emp.businessUnit}</td>
                    <td className="p-3 hidden lg:table-cell text-gray-300">{emp.startDate}</td>
                    <td className="p-3 hidden sm:table-cell text-gray-300">{emp.seniority || calcSeniority(emp.startDate)} yrs</td>
                    <td className="p-3 hidden lg:table-cell text-gray-300">{emp.role}</td>
                    <td className="p-3 hidden md:table-cell text-gray-300">{emp.age}</td>
                    <td className="p-3 hidden lg:table-cell text-gray-300">{emp.phone}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(emp)} className="p-1.5 hover:bg-gray-600 rounded text-blue-400"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(emp.id)} className="p-1.5 hover:bg-gray-600 rounded text-red-400"><Trash2 size={14} /></button>
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
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="font-semibold flex items-center gap-2">
                <UserPlus size={18} />
                {editingId ? t('editEmployee') : t('addEmployee')}
              </h3>
              <button onClick={resetForm} className="p-1 hover:bg-gray-700 rounded"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('fullName')} *</label>
                <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('businessUnit')}</label>
                  <input type="text" value={form.businessUnit} onChange={e => setForm({...form, businessUnit: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('role')}</label>
                  <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('startDate')}</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value, seniority: calcSeniority(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('age')}</label>
                  <input type="number" value={form.age} onChange={e => setForm({...form, age: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('phone')}</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
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
