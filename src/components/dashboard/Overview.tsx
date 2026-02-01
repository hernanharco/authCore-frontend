import React from 'react';
import { Users, UserCheck, Activity, TrendingUp } from 'lucide-react';

export const Overview = () => {
  // Estos datos en el futuro vendrán de tus Hooks de Python (FastAPI)
  const stats = {
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    userGrowth: 0,
  };

  const recentActivity = [
    { id: 1, user: 'Juan Pérez', action: 'Inicio de sesión', time: 'Hace 5 min' },
    { id: 2, user: 'María García', action: 'Actualizó perfil', time: 'Hace 15 min' },
    { id: 3, user: 'Carlos López', action: 'Creó cuenta', time: 'Hace 1 hora' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido al Dashboard</h2>
        <p className="text-gray-600">Gestión centralizada de tu sistema AuthCore</p>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Usuarios', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Usuarios Activos', value: stats.activeUsers, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Nuevos este mes', value: stats.newUsersThisMonth, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Crecimiento', value: `${stats.userGrowth}%`, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 ${stat.bg} rounded-lg`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Actividad y Acciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b border-gray-50 pb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full p-4 border rounded-lg hover:bg-blue-50 transition text-left flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Gestionar Usuarios</span>
            </button>
            <button className="w-full p-4 border rounded-lg hover:bg-green-50 transition text-left flex items-center space-x-3">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Ver Reportes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};