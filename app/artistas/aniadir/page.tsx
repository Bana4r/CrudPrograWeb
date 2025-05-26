"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

function AnadirArtistaPage() {
  const [nombre, setNombre] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError("");
    
    try {
      // Validación básica
      if (!nombre.trim()) {
        throw new Error("El nombre del artista es obligatorio");
      }

      // Realizar la petición al backend para insertar en la base de datos
      const response = await fetch('/api/artistas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: nombre.trim() }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al guardar el artista');
      }
      
      // Éxito: redirigir a la página de artistas
      router.push("/administrador/artistas");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el artista');
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = () => {
    router.push("/administrador/artistas");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Añadir Nuevo Artista</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Artista
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el nombre del artista"
            required
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={enviando}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50"
          >
            {enviando ? "Guardando..." : "Guardar Artista"}
          </button>
          
          <button
            type="button"
            onClick={handleCancelar}
            disabled={enviando}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AnadirArtista() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AnadirArtistaPage />
    </ProtectedRoute>
  );
}