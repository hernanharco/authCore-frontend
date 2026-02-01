'use client';

import { useState, useCallback, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';
import type {
  LoginRequest,
  LoginResponse,
  ApiErrorResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  AuthState,
  AuthError,
  User
} from '@/types/auth';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
    success: null,
    user: null,
  });

  // --- Helpers de Estado ---
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: AuthError | null) => {
    setState(prev => ({ ...prev, error, success: null }));
  }, []);

  const setSuccess = useCallback((message: string | null) => {
    setState(prev => ({ ...prev, success: message, error: null }));
  }, []);

  const setUser = useCallback((user: User | null) => {
    setState(prev => ({ ...prev, user }));
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, []);

  // --- 1. Persistencia: Recuperar sesión al cargar ---
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
  }, [setUser]);

  // --- 2. Acción: Login Tradicional ---
  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const body = {
        username: credentials.username, 
        password: credentials.password
      };

      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        throw new Error(typeof errorData.detail === 'string' ? errorData.detail : 'Credenciales incorrectas');
      }

      setUser(data.user);
      setSuccess('Inicio de sesión exitoso');

      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }

      return true;
    } catch (error) {
      setError({ message: error instanceof Error ? error.message : 'Error desconocido' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSuccess, setUser]);

  // --- 3. NUEVA ACCIÓN: Login con Google ---
  const loginWithGoogle = useCallback(async (code: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Enviamos el token al endpoint de Google de tu backend
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.google}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: code }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al autenticar con Google');
      }

      const successData = data as LoginResponse;
      setUser(successData.user);
      setSuccess('Conectado con Google con éxito');

      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }

      return true;
    } catch (error) {
      setError({ message: error instanceof Error ? error.message : 'Error en autenticación social' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSuccess, setUser]);

  // --- 4. Acción: Logout ---
  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [setUser]);

  // --- 5. Otras acciones (Olvido/Reset) ---
  const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.forgotPassword}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Error al procesar');
      setSuccess(data.message);
      return true;
    } catch (error) {
      setError({ message: error instanceof Error ? error.message : 'Error desconocido' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSuccess]);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.resetPassword}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Error al restablecer');
      setSuccess(data.message);
      return true;
    } catch (error) {
      setError({ message: error instanceof Error ? error.message : 'Error desconocido' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSuccess]);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  return {
    ...state,
    login,
    loginWithGoogle, // ¡IMPORTANTE: Exportarlo aquí!
    logout,
    forgotPassword,
    resetPassword,
    clearMessages,
  };
};