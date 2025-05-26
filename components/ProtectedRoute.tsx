"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | null; // Cambiar 'user' por 'cliente'
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = null, 
  redirectTo = '/' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Si no hay usuario autenticado, redirigir al login
      if (!user) {
        console.log('No hay usuario autenticado, redirigiendo al login');
        router.push('/');
        return;
      }

      // Si se requiere un rol específico y el usuario no lo tiene
      if (requiredRole && user.tipoUsuario !== requiredRole) {
        console.log(`Acceso denegado. Rol requerido: ${requiredRole}, Rol del usuario: ${user.tipoUsuario}`);
        
        // Redirigir según el rol del usuario
        if (user.tipoUsuario === 'admin') {
          router.push('/administrador');
        } else if (user.tipoUsuario === 'user') {
          router.push('/cliente');
        } else {
          // Si es un tipo de usuario no reconocido, redirigir al login
          router.push('/');
        }
        return;
      }
    }
  }, [user, isLoading, router, requiredRole]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">Verificando acceso...</div>
      </div>
    );
  }

  // Si no hay usuario, mostrar loading (mientras se redirige)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">Redirigiendo al login...</div>
      </div>
    );
  }

  // Si hay un rol requerido y el usuario no lo tiene, mostrar loading (mientras se redirige)
  if (requiredRole && user.tipoUsuario !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">Acceso denegado. Redirigiendo...</div>
      </div>
    );
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
}