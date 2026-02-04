'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google'; // 1. Importamos el hook de Google
import { useAuth } from '@/hooks/useAuth';

//Capturamos los datos del navegador
import { useRouter, useSearchParams } from 'next/navigation';

export const AuthView = () => {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // 2. Capturamos los parámetros de la URL  

  // --- CONFIGURACIÓN DE GOOGLE ---
  // Esta función abre el popup y maneja la respuesta de Google
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Enviamos el access_token al backend mediante tu hook useAuth
      // await auth.loginWithGoogle(tokenResponse.access_token);
      //Ahora recibimos un 'code' que debemos enviar al backend
      const result = await auth.loginWithGoogle(tokenResponse.code);

      if (result) {
        handleRedirect(); //Redirigimos tras el éxito con Google
      }

    },
    onError: () => {
      console.error('Error al abrir el popup de Google');
    },
    //Esta parte se utiliza para recibir el código de autorización code
    flow: 'auth-code',
  });

  // Función auxiliar para manejar la lógica de salto
  const handleRedirect = () => {
    const redirectTo = searchParams.get('redirect'); // Captura el ?redirect=...    

    if (redirectTo && redirectTo !== 'null') {
      // Si existe una URL externa (ej: localhost:3001), saltamos allá
      window.location.href = redirectTo;
    } else {
      // Si no hay parámetro, vamos al dashboard local de AuthCore
      router.push('/dashboard');
    }
  };

  const [view, setView] = useState<'login' | 'forgot' | 'reset'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    newPassword: '',
    resetToken: '',
  });

  // Manejador de login 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await auth.login({ username: formData.username, password: formData.password });

    // Si el login fue exitoso, ejecutamos la redirección
    if (result) {
      handleRedirect();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (auth.error || auth.success) auth.clearMessages();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.forgotPassword(formData.username);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.resetPassword(formData.resetToken, formData.newPassword);
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Usuario / Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Introduce tu usuario"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={auth.isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {auth.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      {/* --- SECCIÓN DE LOGIN SOCIAL --- */}
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O continuar con</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loginGoogle()} // 2. Conectamos la función de Google
          disabled={auth.isLoading}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar con Google
        </button>
      </div>
    </form>
  );

  // ... (renderForgotPasswordForm y renderResetPasswordForm se mantienen igual)
  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPassword} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="tu@email.com"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={auth.isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition"
      >
        {auth.isLoading ? 'Enviando...' : 'Enviar Correo de Recuperación'}
      </button>
    </form>
  );

  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div>
        <label htmlFor="resetToken" className="block text-sm font-medium text-gray-700 mb-2">
          Token de Recuperación
        </label>
        <input
          type="text"
          id="resetToken"
          name="resetToken"
          value={formData.resetToken}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Ingresa el token recibido"
          required
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Nueva Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={auth.isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition"
      >
        {auth.isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {view === 'login' && 'Iniciar Sesión'}
            {view === 'forgot' && 'Recuperar Contraseña'}
            {view === 'reset' && 'Restablecer Contraseña'}
          </h2>
        </div>

        {auth.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{auth.error.message}</p>
          </div>
        )}

        {auth.success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <p className="text-sm text-green-700">{auth.success}</p>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg p-8">
          {view === 'login' && renderLoginForm()}
          {view === 'forgot' && renderForgotPasswordForm()}
          {view === 'reset' && renderResetPasswordForm()}

          <div className="mt-6 text-center">
            {view === 'login' && (
              <button onClick={() => setView('forgot')} className="text-sm text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </button>
            )}
            {(view === 'forgot' || view === 'reset') && (
              <button onClick={() => setView('login')} className="text-sm text-blue-600 hover:text-blue-500">
                Volver al inicio de sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};