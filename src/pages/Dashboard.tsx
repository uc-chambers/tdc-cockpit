import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Users, Truck, Radio, ClipboardList, TrendingUp, Package, MapPin } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { employees, forklifts, equipment, operations } = useData();

  const today = new Date().toISOString().split('T')[0];
  const todayOps = operations.filter(op => op.date === today);
  const todayPallets = todayOps.reduce((sum, op) => sum + op.palletQty, 0);
  const todayDelivered = todayOps.filter(op => op.deliveryType === 'delivered').reduce((sum, op) => sum + op.palletQty, 0);
  const todayReceived = todayOps.filter(op => op.deliveryType === 'received').reduce((sum, op) => sum + op.palletQty, 0);

  const stats = [
    { icon: Users, label: t('totalEmployees'), value: employees.length, gradient: 'gradient-blue' },
    { icon: Truck, label: t('activeForklifts'), value: forklifts.length, gradient: 'gradient-cyan' },
    { icon: ClipboardList, label: t('todayOperations'), value: todayOps.length, gradient: 'gradient-purple' },
    { icon: Radio, label: t('equipmentCount'), value: equipment.length, gradient: 'gradient-pink' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card p-6 animate-fade-in-up">
        <h1 className="text-display mb-2">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">{t('welcomeBack')}</span>
          <span className="ml-2">👋</span>
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>{t('todayOverview')}</p>
      </div>

      {/* Hero Location Card */}
      <div className="hero-card p-8 animate-fade-in-up stagger-1">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex items-center gap-5 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <MapPin size={32} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-heading text-white mb-2">Troup Distribution Center</h3>
              <p className="text-body text-white/85">1394 VALLEY INDUSTRIAL BLVD, Valley, AL 36854</p>
            </div>
          </div>
          <div className="lg:text-right">
            <div className="inline-flex flex-col items-start lg:items-end gap-1 rounded-xl bg-white/20 backdrop-blur-sm px-5 py-3 border border-white/30">
              <span className="text-xs font-semibold text-white/75 uppercase tracking-wider">Total SQF</span>
              <span className="text-3xl font-bold text-white">495,687</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`kpi-card p-6 animate-fade-in-up stagger-${i + 2}`}>
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <TrendingUp size={16} style={{ color: 'var(--success)' }} />
              </div>
              <p className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Today's Operations Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-6 animate-fade-in-up stagger-6">
          <h3 className="text-subheading mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Package size={16} className="text-white" />
            </div>
            {t('summary')} - {today}
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-body" style={{ color: 'var(--text-secondary)' }}>{t('totalPallets')}</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{todayPallets}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-body" style={{ color: 'var(--text-secondary)' }}>{t('totalDelivered')}</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">{todayDelivered}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body" style={{ color: 'var(--text-secondary)' }}>{t('totalReceived')}</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{todayReceived}</span>
            </div>
          </div>
        </div>

        {/* Recent Operations */}
        <div className="card p-6 animate-fade-in-up stagger-7">
          <h3 className="text-subheading mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <ClipboardList size={16} className="text-white" />
            </div>
            {t('recentActivity')}
          </h3>
          <div className="space-y-2.5 max-h-64 overflow-y-auto">
            {operations.length === 0 ? (
              <p className="text-body text-center py-8" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            ) : (
              operations.slice(-5).reverse().map(op => (
                <div key={op.id} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-sm">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-body font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{op.customer}</p>
                    <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{op.date}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{op.palletQty}</span>
                    <span className="badge" style={{
                      backgroundColor: op.deliveryType === 'delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: op.deliveryType === 'delivered' ? 'var(--success)' : 'var(--accent)'
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

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-6 animate-fade-in-up stagger-8">
          <h4 className="text-label mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
            Top Customers
          </h4>
          {(() => {
            const customerMap = new Map<string, number>();
            operations.forEach(op => {
              customerMap.set(op.customer, (customerMap.get(op.customer) || 0) + op.palletQty);
            });
            const sorted = [...customerMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
            return sorted.length > 0 ? (
              <div className="space-y-3">
                {sorted.map(([name, qty]) => (
                  <div key={name} className="flex justify-between items-center">
                    <span className="text-body truncate mr-3" style={{ color: 'var(--text-primary)' }}>{name}</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">{qty}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            );
          })()}
        </div>
        <div className="card p-6 animate-fade-in-up stagger-8">
          <h4 className="text-label mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"></div>
            Active Drivers
          </h4>
          {(() => {
            const drivers = [...new Set(operations.map(op => op.forkliftDriver))].filter(Boolean);
            return drivers.length > 0 ? (
              <div className="space-y-2.5">
                {drivers.slice(0, 5).map(driver => (
                  <div key={driver} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 shrink-0 shadow-sm shadow-emerald-500/50"></div>
                    <span className="text-body font-medium truncate" style={{ color: 'var(--text-primary)' }}>{driver}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            );
          })()}
        </div>
        <div className="card p-6 animate-fade-in-up stagger-8">
          <h4 className="text-label mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
            Business Units
          </h4>
          {(() => {
            const units = [...new Set(employees.map(e => e.businessUnit))].filter(Boolean);
            return units.length > 0 ? (
              <div className="space-y-2.5">
                {units.slice(0, 5).map(unit => (
                  <div key={unit} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 shrink-0 shadow-sm shadow-purple-500/50"></div>
                    <span className="text-body font-medium truncate" style={{ color: 'var(--text-primary)' }}>{unit}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
