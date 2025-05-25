"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CD {
  id: number;
  titulo: string;
  artista_nombre: string;
  precio: number;
  stock: number;
}

export default function Home() {
  const router = useRouter();
  const [cds, setCds] = useState<CD[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);

  const fetchCDs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cds');
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos');
      }
      
      const data = await response.json();
      setCds(data.cds);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCDs();
  }, []);

  const handleArtistasClick = () => {
    router.push('administrador/artistas');
  };

  const handleAniadirCdsClick = () => {
    router.push('administrador/cds/aniadir');
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este CD?')) {
      try {
        setEliminando(id);
        const response = await fetch(`/api/cds?id=${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al eliminar el CD');
        }
        
        // Actualizar la lista de CDs (eliminar el CD de la lista local)
        setCds(cds.filter(cd => cd.id !== id));
      } catch (err: any) {
        console.error('Error al eliminar:', err);
        alert(`Error: ${err.message}`);
      } finally {
        setEliminando(null);
      }
    }
  };

  if (isLoading && cds.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando catálogo de CDs...</p>
      </div>
    );
  }

  if (error && cds.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <p className="text-xl text-red-500">Error: {error}</p>
        <button
          onClick={fetchCDs}
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
        <h1 className="text-3xl font-bold">Catálogo de CDs</h1>
      </header>
      <div className="flex gap-4 mb-6">
        <button 
          onClick={handleArtistasClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Artistas
        </button>
        <button
          onClick={handleAniadirCdsClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Añadir CD
        </button>
      </div>
      
      {isLoading && <p className="text-gray-500 mb-4">Actualizando datos...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artista</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cds.length > 0 ? (
              cds.map((cd) => (
                <tr key={cd.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cd.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cd.titulo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cd.artista_nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cd.precio.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cd.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEliminar(cd.id)}
                      disabled={eliminando === cd.id}
                      className={`text-white font-bold py-1 px-3 rounded text-xs ${
                        eliminando === cd.id 
                          ? 'bg-red-300' 
                          : 'bg-red-500 hover:bg-red-700'
                      }`}
                    >
                      {eliminando === cd.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay CDs disponibles en el catálogo
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}