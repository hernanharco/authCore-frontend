// src/hooks/useUsers.ts
'use client';

import { useState, useCallback } from 'react';
import { API_CONFIG } from '@/config/api';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UsersResponse,
  UserResponse,
  DeleteUserResponse,
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

      const data: UsersResponse = await authenticatedFetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.base}`
      );

      if (data.success) {
        setUsers(data.data);
        setSuccess('Usuarios cargados exitosamente');
      } else {
        throw new Error(data.message || 'Error al cargar usuarios');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSuccess, setUsers, authenticatedFetch]);

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data: UserResponse = await authenticatedFetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.me}`
      );

      if (data.success) {
        setCurrentUser(data.data);
      } else {
        throw new Error(data.message || 'Error al cargar usuario actual');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setCurrentUser, authenticatedFetch]);

  const createUser = useCallback(async (userData: CreateUserRequest): Promise<boolean> => {
    try {
      setCreating(true);
      setError(null);

      const data: UserResponse = await authenticatedFetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.base}`,
        {
          method: 'POST',
          body: JSON.stringify(userData),
        }
      );

      if (data.success) {
        // SINCRONIZACIÓN: Añadir el nuevo usuario a la lista local
        setState(prev => ({
          ...prev,
          users: [...prev.users, data.data],
        }));
        setSuccess('Usuario creado exitosamente');
        return true;
      } else {
        throw new Error(data.message || 'Error al crear usuario');
      }
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

      const data: UserResponse = await authenticatedFetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.base}/${userId}`,
        {
          method: 'PUT',
          body: JSON.stringify(userData),
        }
      );

      if (data.success) {
        // SINCRONIZACIÓN: Actualizar el usuario en la lista local
        setState(prev => ({
          ...prev,
          users: prev.users.map(user =>
            user.id === userId ? data.data : user
          ),
        }));
        
        // Si es el usuario actual, actualizarlo también
        if (state.currentUser?.id === userId) {
          setCurrentUser(data.data);
        }
        
        setSuccess('Usuario actualizado exitosamente');
        return true;
      } else {
        throw new Error(data.message || 'Error al actualizar usuario');
      }
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

      const data: DeleteUserResponse = await authenticatedFetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.base}/${userId}`,
        {
          method: 'DELETE',
        }
      );

      if (data.success) {
        // SINCRONIZACIÓN: Eliminar el usuario de la lista local
        setState(prev => ({
          ...prev,
          users: prev.users.filter(user => user.id !== userId),
        }));
        
        // Si es el usuario actual, limpiarlo
        if (state.currentUser?.id === userId) {
          setCurrentUser(null);
        }
        
        setSuccess('Usuario eliminado exitosamente');
        return true;
      } else {
        throw new Error(data.message || 'Error al eliminar usuario');
      }
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
    deleteUser,
    clearMessages,
    setCurrentUser,
  };
};
