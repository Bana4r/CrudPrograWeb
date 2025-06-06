"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    usuario: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones del frontend
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      setIsLoading(false);
      return;
    }

    if (!formData.primerApellido.trim()) {
      setError('El primer apellido es obligatorio');
      setIsLoading(false);
      return;
    }

    if (!formData.usuario.trim()) {
      setError('El nombre de usuario es obligatorio');
      setIsLoading(false);
      return;
    }

    if (formData.contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          primerApellido: formData.primerApellido.trim(),
          segundoApellido: formData.segundoApellido.trim() || null,
          usuario: formData.usuario.trim(),
          contraseña: formData.contraseña,
          tipoUsuario: 'user'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      // Registro exitoso
      alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
      router.push('/');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl transform transition-all hover:scale-105">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-gray-600">
            Únete a nosotros hoy mismo
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="primerApellido" className="text-sm font-medium text-gray-700">
              Primer Apellido *
            </label>
            <input
              id="primerApellido"
              name="primerApellido"
              type="text"
              required
              value={formData.primerApellido}
              onChange={handleChange}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Tu primer apellido"
            />
          </div>

          <div>
            <label htmlFor="segundoApellido" className="text-sm font-medium text-gray-700">
              Segundo Apellido
            </label>
            <input
              id="segundoApellido"
              name="segundoApellido"
              type="text"
              value={formData.segundoApellido}
              onChange={handleChange}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Tu segundo apellido (opcional)"
            />
          </div>

          <div>
            <label htmlFor="usuario" className="text-sm font-medium text-gray-700">
              Nombre de Usuario *
            </label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              required
              value={formData.usuario}
              onChange={handleChange}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="nombre_usuario"
            />
          </div>

          <div>
            <label htmlFor="contraseña" className="text-sm font-medium text-gray-700">
              Contraseña *
            </label>
            <input
              id="contraseña"
              name="contraseña"
              type="password"
              required
              value={formData.contraseña}
              onChange={handleChange}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmarContraseña" className="text-sm font-medium text-gray-700">
              Confirmar Contraseña *
            </label>
            <input
              id="confirmarContraseña"
              name="confirmarContraseña"
              type="password"
              required
              value={formData.confirmarContraseña}
              onChange={handleChange}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
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
              {isLoading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => router.push('/')}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out bg-transparent border-none cursor-pointer"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}