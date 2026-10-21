import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Users, Truck, Radio, ClipboardList, TrendingUp, Package } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { employees, forklifts, equipment, operations } = useData();

  const today = new Date().toISOString().split('T')[0];
  const todayOps = operations.filter(op => op.date === today);
  const todayPallets = todayOps.reduce((sum, op) => sum + op.palletQty, 0);
  const todayDelivered = todayOps.filter(op => op.deliveryType === 'delivered').reduce((sum, op) => sum + op.palletQty, 0);
  const todayReceived = todayOps.filter(op => op.deliveryType === 'received').reduce((sum, op) => sum + op.palletQty, 0);

  const stats = [
    { icon: Users, label: t('totalEmployees'), value: employees.length, color: 'from-blue-500 to-blue-600' },
    { icon: Truck, label: t('activeForklifts'), value: forklifts.length, color: 'from-green-500 to-green-600' },
    { icon: ClipboardList, label: t('todayOperations'), value: todayOps.length, color: 'from-purple-500 to-purple-600' },
    { icon: Radio, label: t('equipmentCount'), value: equipment.length, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-1">{t('welcomeBack')} 👋</h1>
        <p className="text-gray-400">{t('todayOverview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <TrendingUp size={16} className="text-green-400" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Today's Operations Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Package size={18} className="text-blue-400" />
            {t('summary')} - {today}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">{t('totalPallets')}</span>
              <span className="font-bold text-lg">{todayPallets}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">{t('totalDelivered')}</span>
              <span className="font-bold text-lg text-green-400">{todayDelivered}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">{t('totalReceived')}</span>
              <span className="font-bold text-lg text-blue-400">{todayReceived}</span>
            </div>
          </div>
        </div>

        {/* Recent Operations */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-purple-400" />
            {t('recentActivity')}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {operations.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">{t('noData')}</p>
            ) : (
              operations.slice(-5).reverse().map(op => (
                <div key={op.id} className="flex items-center justify-between py-2 px-3 bg-gray-700/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{op.customer}</p>
                    <p className="text-xs text-gray-400">{op.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{op.palletQty} pallets</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      op.deliveryType === 'delivered'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
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

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Top Customers</h4>
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
                    <span className="truncate mr-2">{name}</span>
                    <span className="text-blue-400 font-medium">{qty} pallets</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">{t('noData')}</p>
            );
          })()}
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Active Drivers</h4>
          {(() => {
            const drivers = [...new Set(operations.map(op => op.forkliftDriver))].filter(Boolean);
            return drivers.length > 0 ? (
              <div className="space-y-1">
                {drivers.slice(0, 5).map(driver => (
                  <div key={driver} className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">{t('noData')}</p>
            );
          })()}
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Business Units</h4>
          {(() => {
            const units = [...new Set(employees.map(e => e.businessUnit))].filter(Boolean);
            return units.length > 0 ? (
              <div className="space-y-1">
                {units.slice(0, 5).map(unit => (
                  <div key={unit} className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span>{unit}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">{t('noData')}</p>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
