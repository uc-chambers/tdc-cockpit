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

  // Filter operations by month/year
  const filteredByMonth = useMemo(() => {
    return operations.filter(op => {
      const d = new Date(op.date);
      return (d.getMonth() + 1) === filterMonth && d.getFullYear() === filterYear;
    });
  }, [operations, filterMonth, filterYear]);

  // Filter by selected date (daily dashboard)
  const dailyOps = useMemo(() => {
    return operations.filter(op => op.date === selectedDate);
  }, [operations, selectedDate]);

  // Search filter
  const filtered = filteredByMonth.filter(op =>
    op.customer.toLowerCase().includes(search.toLowerCase()) ||
    op.responsible.toLowerCase().includes(search.toLowerCase()) ||
    op.forkliftDriver.toLowerCase().includes(search.toLowerCase())
  );

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const totalPallets = filteredByMonth.reduce((sum, op) => sum + op.palletQty, 0);
    const totalDelivered = filteredByMonth.filter(op => op.deliveryType === 'delivered').reduce((sum, op) => sum + op.palletQty, 0);
    const totalReceived = filteredByMonth.filter(op => op.deliveryType === 'received').reduce((sum, op) => sum + op.palletQty, 0);
    const totalTrucks = filteredByMonth.reduce((sum, op) => sum + op.truckOperations, 0);
    return { totalPallets, totalDelivered, totalReceived, totalTrucks };
  }, [filteredByMonth]);

  // Daily stats
  const dailyStats = useMemo(() => {
    const totalPallets = dailyOps.reduce((sum, op) => sum + op.palletQty, 0);
    const totalDelivered = dailyOps.filter(op => op.deliveryType === 'delivered').reduce((sum, op) => sum + op.palletQty, 0);
    const totalReceived = dailyOps.filter(op => op.deliveryType === 'received').reduce((sum, op) => sum + op.palletQty, 0);
    const totalTrucks = dailyOps.reduce((sum, op) => sum + op.truckOperations, 0);
    return { totalPallets, totalDelivered, totalReceived, totalTrucks };
  }, [dailyOps]);

  // Previous day
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
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-400" />
            {t('summary')} - {months[filterMonth - 1]} {filterYear}
          </h3>
          <div className="flex gap-2">
            <select
              value={filterMonth}
              onChange={e => setFilterMonth(parseInt(e.target.value))}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={filterYear}
              onChange={e => setFilterYear(parseInt(e.target.value))}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Package size={14} className="text-purple-400" />
              <span className="text-xs text-gray-400">{t('totalPallets')}</span>
            </div>
            <p className="text-2xl font-bold">{monthlyStats.totalPallets}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-xs text-gray-400">{t('totalDelivered')}</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{monthlyStats.totalDelivered}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-blue-400" />
              <span className="text-xs text-gray-400">{t('totalReceived')}</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{monthlyStats.totalReceived}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Truck size={14} className="text-orange-400" />
              <span className="text-xs text-gray-400">{t('truckOperations')}</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">{monthlyStats.totalTrucks}</p>
          </div>
        </div>
      </div>

      {/* Daily Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Selected Day */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar size={18} className="text-green-400" />
              {t('dailyDashboard')}
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-400">{t('totalPallets')}</span>
              <p className="text-xl font-bold">{dailyStats.totalPallets}</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-400">{t('totalDelivered')}</span>
              <p className="text-xl font-bold text-green-400">{dailyStats.totalDelivered}</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-400">{t('totalReceived')}</span>
              <p className="text-xl font-bold text-blue-400">{dailyStats.totalReceived}</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-400">{t('truckOperations')}</span>
              <p className="text-xl font-bold text-orange-400">{dailyStats.totalTrucks}</p>
            </div>
          </div>
          {/* Daily operations list */}
          <div className="mt-4 space-y-1 max-h-40 overflow-y-auto">
            {dailyOps.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">{t('noData')}</p>
            ) : (
              dailyOps.map(op => (
                <div key={op.id} className="flex items-center justify-between py-1.5 px-2 bg-gray-700/20 rounded text-xs">
                  <span className="font-medium truncate mr-2">{op.customer}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span>{op.palletQty} plts</span>
                    <span className={`px-1.5 py-0.5 rounded ${
                      op.deliveryType === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {op.deliveryType === 'delivered' ? t('delivered') : t('received')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Previous Day */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-yellow-400" />
            {t('previousDay')} - {previousDay}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-400">{t('totalPallets')}</span>
              <p className="text-xl font-bold">{previousDayOps.reduce((s, o) => s + o.palletQty, 0)}</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-400">{t('totalDelivered')}</span>
              <p className="text-xl font-bold text-green-400">{previousDayOps.filter(o => o.deliveryType === 'delivered').reduce((s, o) => s + o.palletQty, 0)}</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-400">{t('totalReceived')}</span>
              <p className="text-xl font-bold text-blue-400">{previousDayOps.filter(o => o.deliveryType === 'received').reduce((s, o) => s + o.palletQty, 0)}</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-400">{t('truckOperations')}</span>
              <p className="text-xl font-bold text-orange-400">{previousDayOps.reduce((s, o) => s + o.truckOperations, 0)}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1 max-h-40 overflow-y-auto">
            {previousDayOps.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">{t('noData')}</p>
            ) : (
              previousDayOps.map(op => (
                <div key={op.id} className="flex items-center justify-between py-1.5 px-2 bg-gray-700/20 rounded text-xs">
                  <span className="font-medium truncate mr-2">{op.customer}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span>{op.palletQty} plts</span>
                    <span className={`px-1.5 py-0.5 rounded ${
                      op.deliveryType === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
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
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> {t('addOperation')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="text-left p-3 font-medium text-gray-400">{t('date')}</th>
                <th className="text-left p-3 font-medium text-gray-400">{t('customer')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden md:table-cell">{t('truckOperations')}</th>
                <th className="text-left p-3 font-medium text-gray-400">{t('palletQty')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden sm:table-cell">{t('deliveryType')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden lg:table-cell">{t('responsible')}</th>
                <th className="text-left p-3 font-medium text-gray-400 hidden lg:table-cell">{t('forkliftDriver')}</th>
                <th className="text-left p-3 font-medium text-gray-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center p-8 text-gray-500">{t('noData')}</td></tr>
              ) : (
                filtered.sort((a, b) => b.date.localeCompare(a.date)).map(op => (
                  <tr key={op.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="p-3 text-gray-300 text-xs">{op.date}</td>
                    <td className="p-3 font-medium">{op.customer}</td>
                    <td className="p-3 hidden md:table-cell text-gray-300">{op.truckOperations}</td>
                    <td className="p-3 font-semibold">{op.palletQty}</td>
                    <td className="p-3 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        op.deliveryType === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {op.deliveryType === 'delivered' ? t('delivered') : t('received')}
                      </span>
                    </td>
                    <td className="p-3 hidden lg:table-cell text-gray-300">{op.responsible}</td>
                    <td className="p-3 hidden lg:table-cell text-gray-300">{op.forkliftDriver}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(op)} className="p-1.5 hover:bg-gray-600 rounded text-blue-400"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(op.id)} className="p-1.5 hover:bg-gray-600 rounded text-red-400"><Trash2 size={14} /></button>
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
              <h3 className="font-semibold">{editingId ? t('editOperation') : t('addOperation')}</h3>
              <button onClick={resetForm} className="p-1 hover:bg-gray-700 rounded"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('date')} *</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('customer')} *</label>
                  <input type="text" value={form.customer} onChange={e => setForm({...form, customer: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('truckOperations')}</label>
                  <input type="number" value={form.truckOperations} onChange={e => setForm({...form, truckOperations: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('palletQty')}</label>
                  <input type="number" value={form.palletQty} onChange={e => setForm({...form, palletQty: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">{t('deliveryType')}</label>
                <select
                  value={form.deliveryType}
                  onChange={e => setForm({...form, deliveryType: e.target.value as 'delivered' | 'received'})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="delivered">{t('delivered')}</option>
                  <option value="received">{t('received')}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('responsible')}</label>
                  <input type="text" value={form.responsible} onChange={e => setForm({...form, responsible: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">{t('forkliftDriver')}</label>
                  <input type="text" value={form.forkliftDriver} onChange={e => setForm({...form, forkliftDriver: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
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
