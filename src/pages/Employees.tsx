import { useState } from 'react';
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field w-full pl-9 pr-4 py-2"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> {t('addEmployee')}
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-6 py-4 text-label" style={{ color: 'var(--text-muted)' }}>{t('fullName')}</th>
                <th className="text-left px-6 py-4 text-label hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{t('businessUnit')}</th>
                <th className="text-left px-6 py-4 text-label hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{t('startDate')}</th>
                <th className="text-left px-6 py-4 text-label hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>{t('seniority')}</th>
                <th className="text-left px-6 py-4 text-label hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{t('role')}</th>
                <th className="text-left px-6 py-4 text-label hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{t('age')}</th>
                <th className="text-left px-6 py-4 text-label hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{t('phone')}</th>
                <th className="text-left px-6 py-4 text-label" style={{ color: 'var(--text-muted)' }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-20" style={{ color: 'var(--text-muted)' }}>{t('noData')}</td></tr>
              ) : (
                filtered.map(emp => (
                  <tr key={emp.id} className="table-row">
                    <td className="px-6 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{emp.fullName}</td>
                    <td className="px-6 py-4 hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{emp.businessUnit}</td>
                    <td className="px-6 py-4 hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>{emp.startDate}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}>
                        {emp.seniority || calcSeniority(emp.startDate)} yrs
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>{emp.role}</td>
                    <td className="px-6 py-4 hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{emp.age}</td>
                    <td className="px-6 py-4 hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>{emp.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(emp)} className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors" style={{ color: 'var(--accent)' }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(emp.id)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" style={{ color: 'var(--danger)' }}>
                          <Trash2 size={14} />
                        </button>
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
        <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4 animate-overlay-enter">
          <div className="modal-content w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-enter">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-subheading flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <UserPlus size={18} style={{ color: 'var(--accent)' }} />
                {editingId ? t('editEmployee') : t('addEmployee')}
              </h3>
              <button onClick={resetForm} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-label mb-1.5 block" style={{ color: 'var(--text-muted)' }}>{t('fullName')} *</label>
                <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                  className="input-field w-full py-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-label mb-1.5 block" style={{ color: 'var(--text-muted)' }}>{t('businessUnit')}</label>
                  <input type="text" value={form.businessUnit} onChange={e => setForm({...form, businessUnit: e.target.value})}
                    className="input-field w-full py-2" />
                </div>
                <div>
                  <label className="text-label mb-1.5 block" style={{ color: 'var(--text-muted)' }}>{t('role')}</label>
                  <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                    className="input-field w-full py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-label mb-1.5 block" style={{ color: 'var(--text-muted)' }}>{t('startDate')}</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value, seniority: calcSeniority(e.target.value)})}
                    className="input-field w-full py-2" />
                </div>
                <div>
                  <label className="text-label mb-1.5 block" style={{ color: 'var(--text-muted)' }}>{t('age')}</label>
                  <input type="number" value={form.age} onChange={e => setForm({...form, age: parseInt(e.target.value) || 0})}
                    className="input-field w-full py-2" />
                </div>
              </div>
              <div>
                <label className="text-label mb-1.5 block" style={{ color: 'var(--text-muted)' }}>{t('phone')}</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="input-field w-full py-2" />
              </div>
            </div>
            <div className="flex gap-2 px-6 py-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button onClick={resetForm} className="btn-secondary flex-1">{t('cancel')}</button>
              <button onClick={handleSave} className="btn-primary flex-1">{t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
