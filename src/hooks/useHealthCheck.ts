import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  environment: string;
  database: 'connected' | 'disconnected';
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
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
      setLastCheck(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // const interval = setInterval(checkHealth, 18000000); // Verificar cada 30 minutos
    // return () => clearInterval(interval);
  }, []);

  const isHealthy = healthData?.status === 'healthy' && healthData?.database === 'connected';

  return {
    healthData,
    loading,
    lastCheck,
    isHealthy,
    checkHealth
  };
};
