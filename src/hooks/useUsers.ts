// src/hooks/useUsers.ts
'use client';

import { useState, useCallback } from 'react';
import { API_CONFIG } from '@/config/api';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserRole,
  UsersState,
  UsersActions
} from '@/types/user';

export const useUsers = (): UsersState & UsersActions => {
  const [state, setState] = useState<UsersState>({
    users: [],
    currentUser: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    success: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setCreating = useCallback((creating: boolean) => {
    setState(prev => ({ ...prev, isCreating: creating }));
  }, []);

  const setUpdating = useCallback((updating: boolean) => {
    setState(prev => ({ ...prev, isUpdating: updating }));
  }, []);

  const setDeleting = useCallback((deleting: boolean) => {
    setState(prev => ({ ...prev, isDeleting: deleting }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, success: null }));
  }, []);

  const setSuccess = useCallback((success: string | null) => {
    setState(prev => ({ ...prev, success, error: null }));
  }, []);

  const setUsers = useCallback((users: User[]) => {
    setState(prev => ({ ...prev, users }));
  }, []);

  const setCurrentUser = useCallback((user: User | null) => {
    setState(prev => ({ ...prev, currentUser: user }));
  }, []);

  // Función helper para hacer peticiones con autenticación
  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Para cookies httpOnly
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.base}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: User[] = await response.json();
      setUsers(data);
      setSuccess('Usuarios cargados exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSuccess, setUsers]);

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.me}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: User = await response.json();
      setCurrentUser(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setCurrentUser]);

  const createUser = useCallback(async (userData: CreateUserRequest): Promise<boolean> => {
    try {
      setCreating(true);
      setError(null);

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.base}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const newUser: User = await response.json();
      setState(prev => ({
        ...prev,
        users: [...prev.users, newUser],
      }));
      setSuccess('Usuario creado exitosamente');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setCreating(false);
    }
  }, []);

  const updateUser = useCallback(async (userId: string, userData: UpdateUserRequest): Promise<boolean> => {
      try {
      setUpdating(true);
      setError(null);

      // 👇 TEMPORAL
      console.log('PUT body:', JSON.stringify(userData));

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.base}/${userId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const updatedUser: User = await response.json();
      setState(prev => ({
        ...prev,
        users: prev.users.map(user =>
          user.id === userId ? updatedUser : user
        ),
      }));

      if (state.currentUser?.id === userId) {
        setCurrentUser(updatedUser);
      }

      setSuccess('Usuario actualizado exitosamente');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);

      console.log('PATCH role body:', JSON.stringify({ role }));

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.base}/${userId}/role`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const updatedUser: User = await response.json();
      setState(prev => ({
        ...prev,
        users: prev.users.map(user =>
          user.id === userId ? updatedUser : user
        ),
      }));

      setSuccess('Rol actualizado correctamente');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.base}/${userId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json(); // { message: string }
      setState(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== userId),
      }));

      if (state.currentUser?.id === userId) {
        setCurrentUser(null);
      }

      setSuccess(result.message || 'Usuario eliminado exitosamente');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  return {
    // Estado
    ...state,

    // Acciones
    fetchUsers,
    fetchMe,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
    clearMessages,
    setCurrentUser,
  };
};
