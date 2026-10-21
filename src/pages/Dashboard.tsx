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
      <div className="card p-6">
        <h1 className="text-display mb-1" style={{ color: 'var(--text-primary)' }}>{t('welcomeBack')} 👋</h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>{t('todayOverview')}</p>
      </div>

      {/* Location Card */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center shrink-0 shadow-sm">
            <MapPin size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-subheading mb-1" style={{ color: 'var(--text-primary)' }}>Troup Distribution Center</h3>
            <p className="text-body mb-3" style={{ color: 'var(--text-secondary)' }}>1394 VALLEY INDUSTRIAL BLVD, Valley, AL 36854</p>
            <div className="inline-flex items-center gap-3 rounded-lg px-4 py-2.5" style={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <span className="text-label" style={{ color: 'var(--text-secondary)' }}>Total SQF</span>
              <span className="text-xl font-bold" style={{ color: 'var(--success)' }}>495,687</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card card-interactive p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.gradient} flex items-center justify-center shadow-sm`}>
                  <Icon size={18} className="text-white" />
                </div>
                <TrendingUp size={14} style={{ color: 'var(--success)' }} />
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Today's Operations Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="text-subheading mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Package size={18} style={{ color: 'var(--accent)' }} />
            {t('summary')} - {today}
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-body" style={{ color: 'var(--text-secondary)' }}>{t('totalPallets')}</span>
              <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{todayPallets}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-body" style={{ color: 'var(--text-secondary)' }}>{t('totalDelivered')}</span>
              <span className="text-lg font-semibold" style={{ color: 'var(--success)' }}>{todayDelivered}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body" style={{ color: 'var(--text-secondary)' }}>{t('totalReceived')}</span>
              <span className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{todayReceived}</span>
            </div>
          </div>
        </div>

        {/* Recent Operations */}
        <div className="card p-6">
          <h3 className="text-subheading mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <ClipboardList size={18} style={{ color: 'var(--accent)' }} />
            {t('recentActivity')}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {operations.length === 0 ? (
              <p className="text-body text-center py-8" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            ) : (
              operations.slice(-5).reverse().map(op => (
                <div key={op.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-body font-medium truncate" style={{ color: 'var(--text-primary)' }}>{op.customer}</p>
                    <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{op.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-body font-semibold" style={{ color: 'var(--text-primary)' }}>{op.palletQty}</span>
                    <span className="badge" style={{
                      backgroundColor: op.deliveryType === 'delivered' ? 'rgba(16, 185, 129, 0.1)' : 'var(--accent-light)',
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <h4 className="text-label mb-4" style={{ color: 'var(--text-muted)' }}>Top Customers</h4>
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
                    <span className="text-body font-semibold shrink-0" style={{ color: 'var(--accent)' }}>{qty}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            );
          })()}
        </div>
        <div className="card p-5">
          <h4 className="text-label mb-4" style={{ color: 'var(--text-muted)' }}>Active Drivers</h4>
          {(() => {
            const drivers = [...new Set(operations.map(op => op.forkliftDriver))].filter(Boolean);
            return drivers.length > 0 ? (
              <div className="space-y-2.5">
                {drivers.slice(0, 5).map(driver => (
                  <div key={driver} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--success)' }}></div>
                    <span className="text-body truncate" style={{ color: 'var(--text-primary)' }}>{driver}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            );
          })()}
        </div>
        <div className="card p-5">
          <h4 className="text-label mb-4" style={{ color: 'var(--text-muted)' }}>Business Units</h4>
          {(() => {
            const units = [...new Set(employees.map(e => e.businessUnit))].filter(Boolean);
            return units.length > 0 ? (
              <div className="space-y-2.5">
                {units.slice(0, 5).map(unit => (
                  <div key={unit} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }}></div>
                    <span className="text-body truncate" style={{ color: 'var(--text-primary)' }}>{unit}</span>
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
