// src/types/user.ts

export interface User {
  id: string;
  email: string;
  name: string;
  lastName?: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  lastName?: string;
  password: string;
  role: 'admin' | 'user' | 'moderator';
}

export interface UpdateUserRequest {
  name?: string;
  lastName?: string;
  role?: 'admin' | 'user' | 'moderator';
  isActive?: boolean;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
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
  deleteUser: (userId: string) => Promise<boolean>;
  clearMessages: () => void;
  setCurrentUser: (user: User | null) => void;
}
