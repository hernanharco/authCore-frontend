'use client';

import { Database, CheckCircle, XCircle, RefreshCw, Activity } from 'lucide-react';
import { useHealthCheck } from '@/hooks/useHealthCheck';

export default function HealthCheck() {
  const { healthData, loading, lastCheck, isHealthy, checkHealth } = useHealthCheck();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Panel de Salud del Sistema
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Monitoreo del estado de la conexión a la base de datos NEON
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tarjeta principal de estado */}
          <div className="md:col-span-2">
            <div className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ${isHealthy
              ? 'bg-linear-to-r from-emerald-500 to-teal-600'
              : 'bg-linear-to-r from-red-500 to-rose-600'
              }`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-white/20 backdrop-blur-sm`}>
                      {isHealthy ? (
                        <Database className="w-8 h-8 text-white" />
                      ) : (
                        <Database className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Base de Datos NEON
                      </h2>
                      <p className="text-white/80">
                        {isHealthy ? 'Conectada y funcionando correctamente' : 'Error de conexión'}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm`}>
                    {loading ? (
                      <RefreshCw className="w-5 h-5 text-white animate-spin" />
                    ) : isHealthy ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <XCircle className="w-5 h-5 text-white" />
                    )}
                    <span className="text-white font-medium">
                      {loading ? 'Verificando...' : isHealthy ? 'Saludable' : 'No saludable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de detalles */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Estado del Sistema
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Estado:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${healthData?.status === 'healthy'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                  {healthData?.status || 'Desconocido'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Base de datos:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${healthData?.database === 'connected'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                  {healthData?.database === 'connected' ? 'Conectada' : 'Desconectada'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Entorno:</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {healthData?.environment || 'Desconocido'}
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta de información */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Información
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Última verificación:</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm">
                  {lastCheck ? lastCheck.toLocaleTimeString() : 'Nunca'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Auto-refresh:</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm">30 segundos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error details */}
        {healthData?.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Detalles del Error
            </h3>
            <p className="text-red-600 dark:text-red-400 font-mono text-sm">
              {healthData.error}
            </p>
          </div>
        )}

        {/* Botón de refresh */}
        <div className="text-center">
          <button
            onClick={checkHealth}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Verificar Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
}
