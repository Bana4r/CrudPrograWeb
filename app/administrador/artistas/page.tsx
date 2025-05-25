"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Artista {
  id: number;
  nombre: string;   
}

export default function Artistas() {
  const router = useRouter();
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);

  const fetchArtistas = async () => {
    try {
      const response = await fetch('/api/artistas');
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos de artistas');
      }
      
      const data = await response.json();
      setArtistas(data.artistas);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistas();
  }, []);

  const handleVolverClick = () => {
    router.push('/');
  };

  const handleAniadirClick = () => {
    router.push('/administrador/artistas/aniadir');
  };

  const handleEliminarClick = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este artista?')) {
      try {
        setEliminando(id);
        const response = await fetch(`/api/artistas?id=${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          // Si es un error de dependencias (409 Conflict)
          if (response.status === 409 && data.inUse) {
            alert(`No se puede eliminar este artista porque está asociado a ${data.count} CD(s).`);
          } else {
            throw new Error(data.error || 'Error al eliminar el artista');
          }
        } else {
          // Actualizar la lista después de eliminar exitosamente
          fetchArtistas();
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setEliminando(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando artistas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <button 
          onClick={() => {setError(null); fetchArtistas();}}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Catálogo de Artistas</h1>
      </header>
      <div className="flex gap-4 mb-6">
        <button 
          onClick={handleVolverClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver al Catálogo de CDs
        </button>
        <button
          onClick={handleAniadirClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Añadir artista
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {artistas.length > 0 ? (
              artistas.map((artista) => (
                <tr key={artista.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artista.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{artista.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEliminarClick(artista.id)}
                      disabled={eliminando === artista.id}
                      className={`text-white font-bold py-1 px-3 rounded text-xs ${
                        eliminando === artista.id 
                          ? 'bg-red-300' 
                          : 'bg-red-500 hover:bg-red-700'
                      }`}
                    >
                      {eliminando === artista.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay artistas disponibles en el catálogo
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}