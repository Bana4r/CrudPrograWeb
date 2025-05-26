"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  usuario: string;
  tipoUsuario: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si existe una sesión activa al cargar
    const userCookie = Cookies.get('user-session');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        Cookies.remove('user-session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, rememberMe: boolean = false) => {
    setUser(userData);
    
    if (rememberMe) {
      // Cookie persistente por 30 días
      Cookies.set('user-session', JSON.stringify(userData), { expires: 30 });
    } else {
      // Cookie de sesión (se elimina al cerrar navegador)
      Cookies.set('user-session', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    try {
      // Llamar al API de logout para limpiar cookies del servidor
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Limpiar estado local
      setUser(null);
      
      // Eliminar todas las cookies relacionadas
      Cookies.remove('user-session');
      Cookies.remove('user-session', { path: '/' });
      
      // Limpiar localStorage también por si acaso
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Aún así, limpiar el estado local
      setUser(null);
      Cookies.remove('user-session');
      Cookies.remove('user-session', { path: '/' });
    }
  };

  return { user, isLoading, login, logout };
}