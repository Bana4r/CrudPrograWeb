"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginMenu() {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { user, login } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      if ((user as any).tipoUsuario === 'admin') {
        router.push('/administrador/');
      } else {
        router.push('/cliente/');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contraseña, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Usar el hook de autenticación para manejar el login con rememberMe
      login(data.user, rememberMe);
      
      console.log('Inicio de sesión exitoso:', data.user);
      console.log('Recordar usuario:', rememberMe ? '30 días' : 'Solo esta sesión');
      
      // La redirección se maneja en el useEffect

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Si ya está autenticado, mostrar un loading
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">Redirigiendo...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl transform transition-all hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Iniciar Sesión
        </h2>
        <p className="text-center text-gray-600">
          Bienvenido de nuevo. ¡Te hemos extrañado!
        </p>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="usuario"
              className="text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                id="usuario"
                name="usuario"
                type="text"
                autoComplete="username"
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="tu_usuario"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contraseña"
              className="text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                id="contraseña"
                name="contraseña"
                type="password"
                autoComplete="current-password"
                required
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition duration-150 ease-in-out"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Recordarme por 30 días
              </label>
            </div>

            
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Procesando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={() => router.push('/registro')}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out bg-transparent border-none cursor-pointer"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}