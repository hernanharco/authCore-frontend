// src/config/api.ts

export const API_CONFIG = {
  baseUrl: '',  // ✅ vacío — los Route Handlers están en el mismo Next.js
  endpoints: {
    health: '/backend/health',
    auth: {
      login: '/backend/api/v1/auth/login',
      google: '/backend/api/v1/auth/google',
      forgotPassword: '/backend/api/v1/auth/forgot-password',
      resetPassword: '/backend/api/v1/auth/reset-password',
    },
    users: {
      base: '/api/users',   // ✅ apunta al Route Handler local
      me: '/backend/api/v1/users/me',
    },
  },
};