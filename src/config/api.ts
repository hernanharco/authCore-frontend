// src/config/api.ts

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/backend',
  endpoints: {
    health: '/health',    
    auth: {
      login: '/api/v1/auth/login',
      google: '/api/v1/auth/google',
      forgotPassword: '/api/v1/auth/forgot-password',
      resetPassword: '/api/v1/auth/reset-password',
    },
    users: {
      base: '/api/v1/users',
      me: '/api/v1/users/me',
    },
  },
};