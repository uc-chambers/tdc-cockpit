import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData, Operation } from '../context/DataContext';
import { Plus, Search, Edit2, Trash2, X, Calendar, TrendingUp, Package, Truck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Operations() {
  const { t, language } = useLanguage();
  const { operations, setOperations } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0]);

  const [form, setForm] = useState<Omit<Operation, 'id'>>({
    date: now.toISOString().split('T')[0],
    customer: '',
    truckOperations: 0,
    palletQty: 0,
    deliveryType: 'delivered',
    responsible: '',
    forkliftDriver: ''
  });

  const months = [
    t('january'), t('february'), t('march'), t('april'), t('may'), t('june'),
    t('july'), t('august'), t('september'), t('october'), t('november'), t('december')
  ];

  const filteredByMonth = useMemo(() => {
    return operations.filter(op => {
      const d = new Date(op.date);
      return (d.getMonth() + 1) === filterMonth && d.getFullYear() === filterYear;
    });
  }, [operations, filterMonth, filterYear]);

  const dailyOps = useMemo(() => {
    return operations.filter(op => op.date === selectedDate);
  }, [operations, selectedDate]);

  const filtered = filteredByMonth.filter(op =>
    op.customer.toLowerCase().includes(search.toLowerCase()) ||
    op.responsible.toLowerCase().includes(search.toLowerCase()) ||
    op.forkliftDriver.toLowerCase().includes(search.toLowerCase())
  );

  const monthlyStats = useMemo(() => {
    const totalPallets = filteredByMonth.reduce((sum, op) => sum + op.palletQty, 0);
    const totalDelivered = filteredByMonth.filter(op => op.deliveryType === 'delivered').reduce((sum, op) => sum + op.palletQty, 0);
    const totalReceived = filteredByMonth.filter(op => op.deliveryType === 'received').reduce((sum, op) => sum + op.palletQty, 0);
    const totalTrucks = filteredByMonth.reduce((sum, op) => sum + op.truckOperations, 0);
    return { totalPallets, totalDelivered, totalReceived, totalTrucks };
  }, [filteredByMonth]);

  const dailyStats = useMemo(() => {
    const totalPallets = dailyOps.reduce((sum, op) => sum + op.palletQty, 0);
    const totalDelivered = dailyOps.filter(op => op.deliveryType === 'delivered').reduce((sum, op) => sum + op.palletQty, 0);
    const totalReceived = dailyOps.filter(op => op.deliveryType === 'received').reduce((sum, op) => sum + op.palletQty, 0);
    const totalTrucks = dailyOps.reduce((sum, op) => sum + op.truckOperations, 0);
    return { totalPallets, totalDelivered, totalReceived, totalTrucks };
  }, [dailyOps]);

  const previousDay = useMemo(() => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }, [selectedDate]);

  const previousDayOps = useMemo(() => {
    return operations.filter(op => op.date === previousDay);
  }, [operations, previousDay]);

  const handleSave = () => {
    if (!form.customer || !form.date) return;
    if (editingId) {
      setOperations(operations.map(op => op.id === editingId ? { ...form, id: editingId } : op));
    } else {
      setOperations([...operations, { ...form, id: uuidv4() }]);
    }
    resetForm();
  };

  const handleEdit = (op: Operation) => {
    setForm({
      date: op.date, customer: op.customer, truckOperations: op.truckOperations,
      palletQty: op.palletQty, deliveryType: op.deliveryType,
      responsible: op.responsible, forkliftDriver: op.forkliftDriver
    });
    setEditingId(op.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setOperations(operations.filter(op => op.id !== id));
  };

  const resetForm = () => {
    setForm({ date: now.toISOString().split('T')[0], customer: '', truckOperations: 0, palletQty: 0, deliveryType: 'delivered', responsible: '', forkliftDriver: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <div className="space-y-4">
      {/* Monthly Dashboard */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
            {t('summary')} - {months[filterMonth - 1]} {filterYear}
          </h3>
          <div className="flex gap-2">
            <select value={filterMonth} onChange={e => setFilterMonth(parseInt(e.target.value))}
              className="input-field">
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <select value={filterYear} onChange={e => setFilterYear(parseInt(e.target.value))}
              className="input-field">
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Package size={14} style={{ color: '#A98CEB' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('totalPallets')}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{monthlyStats.totalPallets}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} style={{ color: '#35C6C8' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('totalDelivered')}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#35C6C8' }}>{monthlyStats.totalDelivered}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('totalReceived')}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{monthlyStats.totalReceived}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Truck size={14} style={{ color: '#F58AB5' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('truckOperations')}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#F58AB5' }}>{monthlyStats.totalTrucks}</p>
          </div>
        </div>
      </div>

      {/* Daily Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Calendar size={18} style={{ color: '#35C6C8' }} />
              {t('dailyDashboard')}
            </h3>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('totalPallets')}</span>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{dailyStats.totalPallets}</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('totalDelivered')}</span>
              <p className="text-xl font-bold" style={{ color: '#35C6C8' }}>{dailyStats.totalDelivered}</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('totalReceived')}</span>
              <p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{dailyStats.totalReceived}</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('truckOperations')}</span>
              <p className="text-xl font-bold" style={{ color: '#F58AB5' }}>{dailyStats.totalTrucks}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
            {dailyOps.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            ) : (
              dailyOps.map(op => (
                <div key={op.id} className="flex items-center justify-between py-2 px-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                  <span className="font-medium truncate mr-2" style={{ color: 'var(--text-primary)' }}>{op.customer}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span style={{ color: 'var(--text-secondary)' }}>{op.palletQty} plts</span>
                    <span className="badge" style={{
                      backgroundColor: op.deliveryType === 'delivered' ? 'rgba(53, 198, 200, 0.1)' : 'rgba(93, 169, 246, 0.1)',
                      color: op.deliveryType === 'delivered' ? '#35C6C8' : 'var(--accent)'
                    }}>
                      {op.deliveryType === 'delivered' ? t('delivered') : t('received')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4" style={{ color: 'var(--text-primary)' }}>
            <Calendar size={18} style={{ color: '#F58AB5' }} />
            {t('previousDay')} - {previousDay}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('totalPallets')}</span>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{previousDayOps.reduce((s, o) => s + o.palletQty, 0)}</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('totalDelivered')}</span>
              <p className="text-xl font-bold" style={{ color: '#35C6C8' }}>{previousDayOps.filter(o => o.deliveryType === 'delivered').reduce((s, o) => s + o.palletQty, 0)}</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('totalReceived')}</span>
              <p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{previousDayOps.filter(o => o.deliveryType === 'received').reduce((s, o) => s + o.palletQty, 0)}</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('truckOperations')}</span>
              <p className="text-xl font-bold" style={{ color: '#F58AB5' }}>{previousDayOps.reduce((s, o) => s + o.truckOperations, 0)}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
            {previousDayOps.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            ) : (
              previousDayOps.map(op => (
                <div key={op.id} className="flex items-center justify-between py-2 px-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                  <span className="font-medium truncate mr-2" style={{ color: 'var(--text-primary)' }}>{op.customer}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span style={{ color: 'var(--text-secondary)' }}>{op.palletQty} plts</span>
                    <span className="badge" style={{
                      backgroundColor: op.deliveryType === 'delivered' ? 'rgba(53, 198, 200, 0.1)' : 'rgba(93, 169, 246, 0.1)',
                      color: op.deliveryType === 'delivered' ? '#35C6C8' : 'var(--accent)'
                    }}>
                      {op.deliveryType === 'delivered' ? t('delivered') : t('received')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Operations Table */}
      <div className="table-container">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)}
              className="input-field w-full pl-9 pr-4" />
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> {t('addOperation')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('date')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('customer')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{t('truckOperations')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('palletQty')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>{t('deliveryType')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{t('responsible')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{t('forkliftDriver')}</th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center p-12" style={{ color: 'var(--text-muted)' }}>{t('noData')}</td></tr>
              ) : (
                filtered.sort((a, b) => b.date.localeCompare(a.date)).map(op => (
                  <tr key={op.id} className="table-row">
                    <td className="p-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{op.date}</td>
                    <td className="p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{op.customer}</td>
                    <td className="p-4 hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{op.truckOperations}</td>
                    <td className="p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{op.palletQty}</td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="badge" style={{
                        backgroundColor: op.deliveryType === 'delivered' ? 'rgba(53, 198, 200, 0.1)' : 'rgba(93, 169, 246, 0.1)',
                        color: op.deliveryType === 'delivered' ? '#35C6C8' : 'var(--accent)'
                      }}>
                        {op.deliveryType === 'delivered' ? t('delivered') : t('received')}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>{op.responsible}</td>
                    <td className="p-4 hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>{op.forkliftDriver}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(op)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--accent)' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(op.id)} className="p-2 rounded-lg transition-colors" style={{ color: '#EF4444' }}><Trash2 size={14} /></button>
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
          <div className="modal-content w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{editingId ? t('editOperation') : t('addOperation')}</h3>
              <button onClick={resetForm} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('date')} *</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('customer')} *</label>
                  <input type="text" value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} className="input-field w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('truckOperations')}</label>
                  <input type="number" value={form.truckOperations} onChange={e => setForm({...form, truckOperations: parseInt(e.target.value) || 0})} className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('palletQty')}</label>
                  <input type="number" value={form.palletQty} onChange={e => setForm({...form, palletQty: parseInt(e.target.value) || 0})} className="input-field w-full" />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('deliveryType')}</label>
                <select value={form.deliveryType} onChange={e => setForm({...form, deliveryType: e.target.value as 'delivered' | 'received'})} className="input-field w-full">
                  <option value="delivered">{t('delivered')}</option>
                  <option value="received">{t('received')}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('responsible')}</label>
                  <input type="text" value={form.responsible} onChange={e => setForm({...form, responsible: e.target.value})} className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t('forkliftDriver')}</label>
                  <input type="text" value={form.forkliftDriver} onChange={e => setForm({...form, forkliftDriver: e.target.value})} className="input-field w-full" />
                </div>
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
