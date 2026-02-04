'use client';

import { Database, CheckCircle, XCircle, RefreshCw, Activity } from 'lucide-react';
import { useHealthCheck } from '@/hooks/useHealthCheck';

export default function HealthCheck() {
  const { healthData, loading, lastCheck, isHealthy, checkHealth } = useHealthCheck();

  // Función auxiliar para determinar si un estado es "saludable" visualmente
  const checkIsHealthy = (status: string | undefined) =>
    status?.toLowerCase().includes('healthy') || status === 'connected';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* Título Principal con Estado Grande */}
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex flex-wrap items-center justify-center gap-3">
            <span className="text-slate-600 dark:text-slate-400">Panel de Salud del Sistema</span>
            <span className={`px-4 py-1 rounded-2xl text-4xl font-bold transition-all duration-500 shadow-sm ${
              checkIsHealthy(healthData?.status)
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
            }`}>
              {healthData?.status || (loading ? 'Consultando...' : 'Desconocido')}
            </span>
          </h1>

          {/* Párrafo de Subtítulo con Color Forzado para evitar el Gris */}
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Monitoreo del estado de la conexión a la base de datos:
            <span className={`font-bold ml-2 transition-colors duration-500 ${
              isHealthy 
                ? 'text-emerald-600 dark:text-emerald-400' // Quitamos el ! si ya no hay conflicto
                : 'text-red-600 dark:text-red-400'
            }`}>
              {healthData?.db_provider || 'Buscando proveedor...'}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tarjeta principal de estado - Corregida para Tailwind v3/v4 compatibility */}
          <div className="md:col-span-2">
            <div className={`relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 ${
              isHealthy
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]"></div>
              <div className="relative p-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
                      <Database className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {healthData?.db_provider || 'Base de Datos'}
                      </h2>
                      <p className="text-white/90 text-lg font-medium">
                        {isHealthy ? 'Conectada y funcionando correctamente' : 'Error de conexión detectado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                    {loading ? (
                      <RefreshCw className="w-6 h-6 text-white animate-spin" />
                    ) : isHealthy ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <XCircle className="w-6 h-6 text-white" />
                    )}
                    <span className="text-white text-xl font-bold uppercase tracking-wider">
                      {loading ? '...' : isHealthy ? 'Saludable' : 'Error'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de detalles - Estado del Sistema */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Estado del Sistema
              </h3>
            </div>
            <div className="space-y-4">
              <DetailRow 
                label="Estado" 
                value={healthData?.status || '---'} 
                isHealthy={checkIsHealthy(healthData?.status)} 
              />
              <DetailRow 
                label="Base de datos" 
                value={healthData?.database === 'connected' ? 'Conectada' : 'Desconectada'} 
                isHealthy={healthData?.database === 'connected'} 
              />
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Entorno:</span>
                <span className="px-3 py-1 rounded-lg text-sm font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 uppercase">
                  {healthData?.environment || 'Desconocido'}
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta de información adicional */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Database className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Información del Check
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-700/50 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Última verificación:</span>
                <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
                  {lastCheck ? lastCheck.toLocaleTimeString() : 'Nunca'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Auto-refresh:</span>
                <span className="text-slate-400 dark:text-slate-500 text-sm italic">Desactivado (Manual)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del error si existe */}
        {healthData?.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start space-x-3">
              <XCircle className="w-6 h-6 text-red-500 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-1">
                  Detalles técnicos del error
                </h3>
                <p className="text-red-600 dark:text-red-400 font-mono text-sm break-all leading-relaxed">
                  {healthData.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botón de acción principal */}
        <div className="text-center">
          <button
            onClick={checkHealth}
            disabled={loading}
            className="group inline-flex items-center space-x-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black text-lg rounded-2xl transition-all duration-300 shadow-xl hover:shadow-blue-500/20 transform active:scale-95"
          >
            <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span>{loading ? 'Verificando Sistema...' : 'VERIFICAR SALUD AHORA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente pequeño para filas de detalle (Clean Code)
function DetailRow({ label, value, isHealthy }: { label: string, value: string, isHealthy: boolean }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-700/50 pb-2">
      <span className="text-slate-500 dark:text-slate-400 font-medium">{label}:</span>
      <span className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
        isHealthy
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        {value}
      </span>
    </div>
  );
}