// src/types/auth.ts

export interface LoginRequest {
  username: string;
  password: string;
}

// Estructura EXACTA de tu backend FastAPI
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    username: string;
    full_name?: string;
    role: string;
    status: string;
  };
}

// Interfaz para capturar errores del backend (401, 422, etc.)
export interface ApiErrorResponse {
  detail: string | { msg: string }[];
}

export type User = LoginResponse['user'];

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface AuthState {
  isLoading: boolean;
  error: AuthError | null;
  success: string | null;
  user: User | null;
}