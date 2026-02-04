import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';

export interface HealthStatus {
  // Cambiamos el tipo a string para permitir variaciones como 'healthy authCore'
  status: string; 
  environment: string;
  database: 'connected' | 'disconnected';
  db_provider: string;
  error?: string;
}

export const useHealthCheck = () => {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.health}`);
      const data = await response.json();
      setHealthData(data);
      setLastCheck(new Date());
    } catch (error) {
      setHealthData({
        status: 'unhealthy',
        environment: 'unknown',
        database: 'disconnected',
        db_provider: 'unknown',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
      setLastCheck(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Solo se ejecuta una vez cuando el Admin abre el panel
    checkHealth();
  }, []);

  // MEJORA: Validación flexible que busca la palabra clave sin importar el "apellido"
  const isHealthy = 
    healthData?.status?.toLowerCase().includes('healthy') && 
    healthData?.database === 'connected';

  return {
    healthData,
    loading,
    lastCheck,
    isHealthy,
    checkHealth
  };
};