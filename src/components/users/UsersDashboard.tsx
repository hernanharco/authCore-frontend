'use client';

import { useState, useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import {
  Users,
  AlertCircle,
  CheckCircle,
  Mail,
  User as UserIcon,
  Calendar,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import type { User, CreateUserRequest, UpdateUserRequest, UserRole } from '@/types/user';
import { ROLE_CONFIG, STATUS_CONFIG } from '@/types/user';

export const UsersDashboard = () => {
  const usersHook = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirm_password: '',
    role: 'USER',
    status: 'ACTIVE',
  });

  // ✅ Solo full_name y role
  const [editFormData, setEditFormData] = useState<Pick<UpdateUserRequest, 'full_name' | 'role'>>({
    full_name: '',
    role: 'USER',
  });

  useEffect(() => {
    usersHook.fetchUsers();
  }, []);

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
      full_name: '',
      password: '',
      confirm_password: '',
      role: 'USER',
      status: 'ACTIVE',
    });
    setEditFormData({ full_name: '', role: 'USER' });
    setEditingUser(null);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      full_name: user.full_name,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    usersHook.clearMessages();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    let success = true;

    // Si cambió full_name — llamar PUT
    if (editFormData.full_name !== editingUser.full_name) {
      success = await usersHook.updateUser(editingUser.id, {
        full_name: editFormData.full_name,
      });
    }

    // Si cambió el role — llamar PATCH /role por separado
    if (success && editFormData.role !== editingUser.role) {
      success = await usersHook.updateUserRole(editingUser.id, editFormData.role as UserRole);
    }

    if (success) {
      await usersHook.fetchUsers(); // ✅ refresca la lista desde el backend
      closeModal();
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"?`)) {
      await usersHook.deleteUser(userId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-4 md:p-6 mb-6">
          <div className="flex items-center space-x-3">
            <Users className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-sm text-gray-600">Administra los usuarios del sistema</p>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        {usersHook.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{usersHook.error}</p>
          </div>
        )}

        {usersHook.success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <p className="text-sm text-green-700">{usersHook.success}</p>
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {usersHook.isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : usersHook.users.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No hay usuarios registrados
            </div>
          ) : (
            <>
              {/* ✅ Mobile — cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {usersHook.users.map((user) => (
                  <div key={user.id} className="p-4 space-y-3">

                    {/* Fila 1: Avatar + nombre + email */}
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-gray-400">@{user.username}</p>
                      </div>
                    </div>

                    {/* Fila 2: badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ROLE_CONFIG[user.role]?.color ?? 'bg-gray-100 text-gray-800'}`}>
                        {ROLE_CONFIG[user.role]?.label ?? user.role}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_CONFIG[user.status]?.color ?? 'bg-gray-100 text-gray-800'}`}>
                        {STATUS_CONFIG[user.status]?.label ?? user.status}
                      </span>
                    </div>

                    {/* Fila 3: origen + fecha + acciones */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {user.origin && (
                          <p className="text-xs text-gray-500">{user.origin}</p>
                        )}
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.created_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.full_name)}
                          className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                          title="Eliminar"
                          disabled={usersHook.isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* ✅ Desktop — tabla */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creación</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersHook.users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-gray-300 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                {user.email}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ROLE_CONFIG[user.role]?.color ?? 'bg-gray-100 text-gray-800'}`}>
                            {ROLE_CONFIG[user.role]?.label ?? user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_CONFIG[user.status]?.color ?? 'bg-gray-100 text-gray-800'}`}>
                            {STATUS_CONFIG[user.status]?.label ?? user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {user.origin ?? '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(user.created_at).toLocaleDateString('es-ES')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id, user.full_name)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Eliminar"
                              disabled={usersHook.isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Modal Editar — full_name y role */}
        {isModalOpen && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Editar Usuario</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* ✅ Nombre completo — editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.full_name}
                    onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* ✅ Rol — editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {(Object.keys(ROLE_CONFIG) as UserRole[])
                      .filter(r => r !== 'NONE')
                      .map(r => (
                        <option key={r} value={r}>
                          {ROLE_CONFIG[r].label}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Info de solo lectura */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Email:</span> {editingUser.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Username:</span> @{editingUser.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Estado:</span>{' '}
                    <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${STATUS_CONFIG[editingUser.status]?.color}`}>
                      {STATUS_CONFIG[editingUser.status]?.label}
                    </span>
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={usersHook.isUpdating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {usersHook.isUpdating ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Actualizando...
                      </span>
                    ) : 'Actualizar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};