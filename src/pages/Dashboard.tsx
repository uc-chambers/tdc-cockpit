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
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{t('welcomeBack')} 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('todayOverview')}</p>
      </div>

      {/* Location Card */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center shrink-0 shadow-lg">
            <MapPin size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Troup Distribution Center</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>1394 VALLEY INDUSTRIAL BLVD, Valley, AL 36854</p>
            <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2" style={{ 
              backgroundColor: 'rgba(53, 198, 200, 0.1)',
              border: '1px solid rgba(53, 198, 200, 0.3)'
            }}>
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Total SQF</span>
              <span className="text-lg font-bold" style={{ color: '#35C6C8' }}>495,687</span>
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
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${stat.gradient} flex items-center justify-center shadow-md`}>
                  <Icon size={20} className="text-white" />
                </div>
                <TrendingUp size={16} style={{ color: '#35C6C8' }} />
              </div>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Today's Operations Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Package size={18} style={{ color: 'var(--accent)' }} />
            {t('summary')} - {today}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('totalPallets')}</span>
              <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{todayPallets}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('totalDelivered')}</span>
              <span className="font-bold text-lg" style={{ color: '#35C6C8' }}>{todayDelivered}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span style={{ color: 'var(--text-secondary)' }}>{t('totalReceived')}</span>
              <span className="font-bold text-lg" style={{ color: 'var(--accent)' }}>{todayReceived}</span>
            </div>
          </div>
        </div>

        {/* Recent Operations */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <ClipboardList size={18} style={{ color: 'var(--accent)' }} />
            {t('recentActivity')}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {operations.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            ) : (
              operations.slice(-5).reverse().map(op => (
                <div key={op.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{op.customer}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{op.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{op.palletQty} pallets</span>
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

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Top Customers</h4>
          {(() => {
            const customerMap = new Map<string, number>();
            operations.forEach(op => {
              customerMap.set(op.customer, (customerMap.get(op.customer) || 0) + op.palletQty);
            });
            const sorted = [...customerMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
            return sorted.length > 0 ? (
              <div className="space-y-2">
                {sorted.map(([name, qty]) => (
                  <div key={name} className="flex justify-between text-sm">
                    <span className="truncate mr-2" style={{ color: 'var(--text-primary)' }}>{name}</span>
                    <span className="font-medium" style={{ color: 'var(--accent)' }}>{qty} pallets</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            );
          })()}
        </div>
        <div className="card p-5">
          <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Active Drivers</h4>
          {(() => {
            const drivers = [...new Set(operations.map(op => op.forkliftDriver))].filter(Boolean);
            return drivers.length > 0 ? (
              <div className="space-y-2">
                {drivers.slice(0, 5).map(driver => (
                  <div key={driver} className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#35C6C8' }}></div>
                    <span style={{ color: 'var(--text-primary)' }}>{driver}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            );
          })()}
        </div>
        <div className="card p-5">
          <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Business Units</h4>
          {(() => {
            const units = [...new Set(employees.map(e => e.businessUnit))].filter(Boolean);
            return units.length > 0 ? (
              <div className="space-y-2">
                {units.slice(0, 5).map(unit => (
                  <div key={unit} className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>
                    <span style={{ color: 'var(--text-primary)' }}>{unit}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('noData')}</p>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
