export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'MANAGER' | 'USER' | 'VIEWER' | 'NONE';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

// ✅ Fuente de verdad — refleja exactamente los valores de la BD
export const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  SUPERADMIN: { label: 'Super Admin',   color: 'bg-purple-100 text-purple-800' },
  ADMIN:      { label: 'Administrador', color: 'bg-red-100 text-red-800'       },
  MANAGER:    { label: 'Gerente',       color: 'bg-blue-100 text-blue-800'     },
  USER:       { label: 'Usuario',       color: 'bg-green-100 text-green-800'   },
  VIEWER:     { label: 'Visor',         color: 'bg-gray-100 text-gray-800'     },
  NONE:       { label: 'Pendiente',     color: 'bg-yellow-100 text-yellow-800' },
};

export const STATUS_CONFIG: Record<UserStatus, { label: string; color: string }> = {
  ACTIVE:    { label: 'Activo',     color: 'bg-green-100 text-green-800'   },
  INACTIVE:  { label: 'Inactivo',   color: 'bg-red-100 text-red-800'       },
  SUSPENDED: { label: 'Suspendido', color: 'bg-orange-100 text-orange-800' },
  PENDING:   { label: 'Pendiente',  color: 'bg-yellow-100 text-yellow-800' },
};

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  is_active: boolean;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
  origin?: string | null;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  full_name: string;
  password: string;
  confirm_password: string;
  role: UserRole;      // ✅ usa el tipo centralizado
  status: UserStatus;  // ✅ usa el tipo centralizado
}

export interface UpdateUserRequest {
  username?: string;
  full_name?: string;
  role?: UserRole;
}

export interface UsersState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  success: string | null;
}

export interface UsersActions {
  fetchUsers: () => Promise<void>;
  fetchMe: () => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<boolean>;
  updateUser: (userId: string, userData: UpdateUserRequest) => Promise<boolean>;
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  clearMessages: () => void;
  setCurrentUser: (user: User | null) => void;
}