import React, { useState, useMemo, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData, Operation } from '../context/DataContext';
import { Plus, Search, Edit2, Trash2, X, Calendar, TrendingUp, Package, Truck, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

  // Import Excel states
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState<Omit<Operation, 'id'>[]>([]);
  const [importFileName, setImportFileName] = useState('');
  const [importPassword, setImportPassword] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedOperations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, filterMonth, filterYear]);

  const monthlyStats = useMemo(() => {
    const totalPallets = filteredByMonth.reduce((sum, op) => sum + op.palletQty, 0);
    const totalDelivered = filteredByMonth.filter(op => op.deliveryType === 'delivered').reduce((sum, op) => sum + op.palletQty, 0);
    const totalReceived = filteredByMonth.filter(op => op.deliveryType === 'received').reduce((sum, op) => sum + op.palletQty, 0);
    const totalTrucks = filteredByMonth.reduce((sum, op) => sum + op.truckOperations, 0);
    return { totalPallets, totalDelivered, totalReceived, totalTrucks };
  }, [filteredByMonth]);

  // Data for truck operations pie chart
  const truckOperationsData = useMemo(() => {
    const delivered = filteredByMonth
      .filter(op => op.deliveryType === 'delivered')
      .reduce((sum, op) => sum + op.truckOperations, 0);
    const received = filteredByMonth
      .filter(op => op.deliveryType === 'received')
      .reduce((sum, op) => sum + op.truckOperations, 0);
    
    return [
      { name: 'Delivered', value: delivered, color: '#06b6d4' },
      { name: 'Received', value: received, color: '#8b5cf6' }
    ];
  }, [filteredByMonth]);

  // Data for pallets trend chart (by day)
  const palletsTrendData = useMemo(() => {
    const dailyData = new Map<string, { date: string; delivered: number; received: number }>();
    
    filteredByMonth.forEach(op => {
      const date = op.date;
      if (!dailyData.has(date)) {
        dailyData.set(date, { date, delivered: 0, received: 0 });
      }
      const dayData = dailyData.get(date)!;
      if (op.deliveryType === 'delivered') {
        dayData.delivered += op.palletQty;
      } else {
        dayData.received += op.palletQty;
      }
    });
    
    return Array.from(dailyData.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
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

  // Excel Import functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setImportError('');
    setImportPassword('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const parsed: Omit<Operation, 'id'>[] = data.map((row: any) => {
          // Try to map common column names
          const dateVal = row.date || row.Date || row.fecha || row.Fecha || '';
          const customer = row.customer || row.Customer || row.cliente || row.Cliente || '';
          const truckOps = parseInt(row.truckOperations || row['Truck Operations'] || row.operaciones || row['Operaciones de camion'] || 0) || 0;
          const palletQty = parseInt(row.palletQty || row['Pallet Qty'] || row.tarimas || row['Cantidad de tarimas'] || 0) || 0;
          const deliveryType = (row.deliveryType || row['Delivery Type'] || row.tipo || '').toLowerCase();
          const responsible = row.responsible || row.Responsible || row.responsable || row.Responsable || '';
          const forkliftDriver = row.forkliftDriver || row['Forklift Driver'] || row.operador || row.Operador || '';

          // Normalize delivery type
          let normalizedDelivery: 'delivered' | 'received' = 'delivered';
          if (deliveryType.includes('received') || deliveryType.includes('recibido')) {
            normalizedDelivery = 'received';
          }

          // Normalize date
          let normalizedDate = '';
          if (dateVal) {
            if (typeof dateVal === 'number') {
              // Excel serial date
              const date = XLSX.SSF.parse_date_code(dateVal);
              if (date) {
                normalizedDate = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
              }
            } else {
              normalizedDate = String(dateVal);
              // Try to parse common date formats
              const d = new Date(dateVal);
              if (!isNaN(d.getTime())) {
                normalizedDate = d.toISOString().split('T')[0];
              }
            }
          }

          return {
            date: normalizedDate,
            customer: String(customer),
            truckOperations: truckOps,
            palletQty: palletQty,
            deliveryType: normalizedDelivery,
            responsible: String(responsible),
            forkliftDriver: String(forkliftDriver)
          };
        }).filter(row => row.customer && row.date);

        setImportData(parsed);
      } catch (err) {
        setImportError('Error reading file. Please check the format.');
        setImportData([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    if (importPassword !== 'tdc2026@') {
      setImportError('Incorrect password. Import cancelled.');
      return;
    }
    if (importData.length === 0) {
      setImportError('No valid data to import.');
      return;
    }

    const newOps: Operation[] = importData.map(row => ({
      ...row,
      id: uuidv4()
    }));

    setOperations([...operations, ...newOps]);
    resetImport();
  };

  const resetImport = () => {
    setShowImport(false);
    setImportData([]);
    setImportFileName('');
    setImportPassword('');
    setImportError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Package size={14} style={{ color: '#8B5CF6' }} />
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('totalPallets')}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{monthlyStats.totalPallets}</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp size={14} style={{ color: '#06B6D4' }} />
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('totalDelivered')}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#06B6D4' }}>{monthlyStats.totalDelivered}</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('totalReceived')}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{monthlyStats.totalReceived}</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Truck size={14} style={{ color: '#EC4899' }} />
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('truckOperations')}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#EC4899' }}>{monthlyStats.totalTrucks}</p>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          {/* Truck Operations Pie Chart */}
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-subheading flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">
                  <Truck size={18} className="text-white" />
                </div>
                Truck Operations
              </h4>
              <span className="text-caption px-3 py-1 rounded-full" style={{ 
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                color: '#06b6d4'
              }}>
                {truckOperationsData.reduce((sum, item) => sum + item.value, 0)} total
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="gradientDelivered" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                    <linearGradient id="gradientReceived" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={truckOperationsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="url(#gradientDelivered)" />
                    <Cell fill="url(#gradientReceived)" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      padding: '12px 16px'
                    }}
                    itemStyle={{ color: 'var(--text-primary)', fontWeight: '600' }}
                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              {truckOperationsData.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ 
                      backgroundColor: item.color,
                      boxShadow: `0 2px 8px ${item.color}40`
                    }}></div>
                    <span className="text-body font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pallets Trend Area Chart */}
          <div className="card p-6 animate-fade-in-up stagger-1">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-subheading flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                  <Package size={18} className="text-white" />
                </div>
                Pallets Trend
              </h4>
              <span className="text-caption px-3 py-1 rounded-full" style={{ 
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                color: '#8b5cf6'
              }}>
                {palletsTrendData.length} days
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={palletsTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="var(--border-color)" 
                    opacity={0.2}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-muted)" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      padding: '12px 16px'
                    }}
                    itemStyle={{ color: 'var(--text-primary)', fontWeight: '600' }}
                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: '8px' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '13px', fontWeight: '500' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="delivered" 
                    name="Delivered"
                    stroke="#06b6d4" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorDelivered)" 
                    dot={{ fill: '#06b6d4', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2, fill: 'white' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="received" 
                    name="Received"
                    stroke="#8b5cf6" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorReceived)" 
                    dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: 'white' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-subheading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">
                <Calendar size={18} className="text-white" />
              </div>
              {t('dailyDashboard')}
            </h3>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="kpi-card p-4">
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('totalPallets')}</span>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{dailyStats.totalPallets}</p>
            </div>
            <div className="kpi-card p-4">
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('totalDelivered')}</span>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">{dailyStats.totalDelivered}</p>
            </div>
            <div className="kpi-card p-4">
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('totalReceived')}</span>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{dailyStats.totalReceived}</p>
            </div>
            <div className="kpi-card p-4">
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('truckOperations')}</span>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">{dailyStats.totalTrucks}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
            {dailyOps.length === 0 ? (
              <p className="text-caption text-center py-6" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            ) : (
              dailyOps.map(op => (
                <div key={op.id} className="flex items-center justify-between py-2 px-3 rounded-md text-caption" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                  <span className="font-medium truncate mr-2" style={{ color: 'var(--text-primary)' }}>{op.customer}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span style={{ color: 'var(--text-secondary)' }}>{op.palletQty}</span>
                    <span className="badge" style={{
                      backgroundColor: op.deliveryType === 'delivered' ? 'rgba(6, 182, 212, 0.1)' : 'var(--accent-light)',
                      color: op.deliveryType === 'delivered' ? '#06B6D4' : 'var(--accent)'
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
          <h3 className="text-subheading flex items-center gap-3 mb-5" style={{ color: 'var(--text-primary)' }}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md">
              <Calendar size={18} className="text-white" />
            </div>
            {t('previousDay')} - {previousDay}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="kpi-card p-4">
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('totalPallets')}</span>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{previousDayOps.reduce((s, o) => s + o.palletQty, 0)}</p>
            </div>
            <div className="kpi-card p-4">
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('totalDelivered')}</span>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">{previousDayOps.filter(o => o.deliveryType === 'delivered').reduce((s, o) => s + o.palletQty, 0)}</p>
            </div>
            <div className="kpi-card p-4">
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('totalReceived')}</span>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{previousDayOps.filter(o => o.deliveryType === 'received').reduce((s, o) => s + o.palletQty, 0)}</p>
            </div>
            <div className="kpi-card p-4">
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('truckOperations')}</span>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">{previousDayOps.reduce((s, o) => s + o.truckOperations, 0)}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
            {previousDayOps.length === 0 ? (
              <p className="text-caption text-center py-6" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            ) : (
              previousDayOps.map(op => (
                <div key={op.id} className="flex items-center justify-between py-2 px-3 rounded-md text-caption" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                  <span className="font-medium truncate mr-2" style={{ color: 'var(--text-primary)' }}>{op.customer}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span style={{ color: 'var(--text-secondary)' }}>{op.palletQty}</span>
                    <span className="badge" style={{
                      backgroundColor: op.deliveryType === 'delivered' ? 'rgba(6, 182, 212, 0.1)' : 'var(--accent-light)',
                      color: op.deliveryType === 'delivered' ? '#06B6D4' : 'var(--accent)'
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
          <div className="flex gap-2">
            <button onClick={() => setShowImport(true)} className="btn-secondary flex items-center gap-2">
              <Upload size={16} /> Import Excel
            </button>
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> {t('addOperation')}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-6 py-4 text-label" style={{ color: 'var(--text-muted)' }}>{t('date')}</th>
                <th className="text-left px-6 py-4 text-label" style={{ color: 'var(--text-muted)' }}>{t('customer')}</th>
                <th className="text-left px-6 py-4 text-label hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{t('truckOperations')}</th>
                <th className="text-left px-6 py-4 text-label" style={{ color: 'var(--text-muted)' }}>{t('palletQty')}</th>
                <th className="text-left px-6 py-4 text-label hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>{t('deliveryType')}</th>
                <th className="text-left px-5 py-3.5 text-label hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{t('responsible')}</th>
                <th className="text-left px-5 py-3.5 text-label hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{t('forkliftDriver')}</th>
                <th className="text-left px-5 py-3.5 text-label" style={{ color: 'var(--text-muted)' }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16" style={{ color: 'var(--text-muted)' }}>{t('noData')}</td></tr>
              ) : (
                paginatedOperations.sort((a, b) => b.date.localeCompare(a.date)).map(op => (
                  <tr key={op.id} className="table-row">
                    <td className="px-6 py-4 text-caption" style={{ color: 'var(--text-secondary)' }}>{op.date}</td>
                    <td className="px-6 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{op.customer}</td>
                    <td className="px-6 py-4 hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{op.truckOperations}</td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{op.palletQty}</span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="badge" style={{
                        backgroundColor: op.deliveryType === 'delivered' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                        color: op.deliveryType === 'delivered' ? 'var(--success)' : 'var(--accent)'
                      }}>
                        {op.deliveryType === 'delivered' ? t('delivered') : t('received')}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>{op.responsible}</td>
                    <td className="px-6 py-4 hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>{op.forkliftDriver}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(op)} className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors" style={{ color: 'var(--accent)' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(op.id)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>Showing</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="input-field py-1 px-2"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>of {filtered.length} operations</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="btn-secondary px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-secondary px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm font-medium px-3" style={{ color: 'var(--text-primary)' }}>
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-secondary px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="btn-secondary px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4 animate-overlay-enter">
          <div className="modal-content w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-enter">
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

      {/* Import Excel Modal */}
      {showImport && (
        <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4 animate-overlay-enter">
          <div className="modal-content w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-enter">
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FileSpreadsheet size={18} style={{ color: 'var(--accent)' }} />
                Import Operations from Excel
              </h3>
              <button onClick={resetImport} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}><X size={18} /></button>
            </div>
            
            <div className="p-5 space-y-4">
              {/* File Upload */}
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Select Excel File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="input-field w-full"
                />
                {importFileName && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    File: {importFileName}
                  </p>
                )}
              </div>

              {/* Preview Data */}
              {importData.length > 0 && (
                <div>
                  <label className="text-xs mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                    Preview ({importData.length} records found)
                  </label>
                  <div className="border rounded-lg overflow-hidden max-h-48 overflow-y-auto" style={{ borderColor: 'var(--border-color)' }}>
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                          <th className="text-left px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>Date</th>
                          <th className="text-left px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>Customer</th>
                          <th className="text-left px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>Pallets</th>
                          <th className="text-left px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importData.slice(0, 10).map((row, idx) => (
                          <tr key={idx} style={{ borderTop: '1px solid var(--border-color)' }}>
                            <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{row.date}</td>
                            <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{row.customer}</td>
                            <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{row.palletQty}</td>
                            <td className="px-3 py-2">
                              <span className="badge" style={{
                                backgroundColor: row.deliveryType === 'delivered' ? 'rgba(6, 182, 212, 0.1)' : 'var(--accent-light)',
                                color: row.deliveryType === 'delivered' ? '#06B6D4' : 'var(--accent)'
                              }}>
                                {row.deliveryType === 'delivered' ? t('delivered') : t('received')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importData.length > 10 && (
                      <p className="text-xs text-center py-2" style={{ color: 'var(--text-muted)' }}>
                        + {importData.length - 10} more records
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Password Confirmation */}
              {importData.length > 0 && (
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    Enter password to confirm import *
                  </label>
                  <input
                    type="password"
                    value={importPassword}
                    onChange={e => { setImportPassword(e.target.value); setImportError(''); }}
                    placeholder="Password required"
                    className="input-field w-full"
                  />
                </div>
              )}

              {/* Error Message */}
              {importError && (
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <AlertCircle size={16} style={{ color: 'var(--danger)' }} />
                  <span className="text-xs" style={{ color: 'var(--danger)' }}>{importError}</span>
                </div>
              )}

              {/* Instructions */}
              <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-surface-secondary)', color: 'var(--text-muted)' }}>
                <p className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Expected Excel columns:</p>
                <p>date, customer, truckOperations, palletQty, deliveryType (delivered/received), responsible, forkliftDriver</p>
              </div>
            </div>

            <div className="flex gap-2 p-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button onClick={resetImport} className="btn-secondary flex-1">{t('cancel')}</button>
              <button 
                onClick={handleImport} 
                disabled={importData.length === 0 || !importPassword}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Import ({importData.length} records)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
