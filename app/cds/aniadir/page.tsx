"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Artista {
  id: number;
  nombre: string;
}

export default function AnadirCD() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [artistaId, setArtistaId] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("0");
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [cargandoArtistas, setCargandoArtistas] = useState(true);

  // Cargar lista de artistas para el selector
  useEffect(() => {
    const fetchArtistas = async () => {
      try {
        const response = await fetch('/api/artistas');
        if (!response.ok) {
          throw new Error('Error al cargar los artistas');
        }
        const data = await response.json();
        setArtistas(data.artistas);
      } catch (err: any) {
        setError("Error al cargar la lista de artistas: " + err.message);
      } finally {
        setCargandoArtistas(false);
      }
    };

    fetchArtistas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError("");
    
    try {
      // Validaciones básicas
      if (!titulo.trim()) {
        throw new Error("El título del CD es obligatorio");
      }
      
      if (!artistaId) {
        throw new Error("Debe seleccionar un artista");
      }
      
      const precioNum = parseFloat(precio);
      if (isNaN(precioNum) || precioNum <= 0) {
        throw new Error("El precio debe ser un número positivo");
      }
      
      const stockNum = parseInt(stock);
      if (isNaN(stockNum) || stockNum < 0) {
        throw new Error("El stock debe ser un número no negativo");
      }
      
      // Realizar la petición al backend para insertar en la base de datos
      const response = await fetch('/api/cds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          titulo, 
          artista_id: parseInt(artistaId), 
          precio: precioNum,
          stock: stockNum 
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al guardar el CD');
      }
      
      // Éxito: redirigir a la página principal
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el CD');
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = () => {
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Añadir Nuevo CD</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Título */}
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título del CD
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Artista */}
        <div className="mb-4">
          <label htmlFor="artista" className="block text-sm font-medium text-gray-700 mb-1">
            Artista
          </label>
          {cargandoArtistas ? (
            <p className="text-sm text-gray-500">Cargando artistas...</p>
          ) : (
            <select
              id="artista"
              value={artistaId}
              onChange={(e) => setArtistaId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Selecciona un artista --</option>
              {artistas.map(artista => (
                <option key={artista.id} value={artista.id}>
                  {artista.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
        
        {/* Precio */}
        <div className="mb-4">
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
            Precio (MXN)
          </label>
          <input
            type="number"
            id="precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        
        {/* Stock */}
        <div className="mb-6">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            required
          />
        </div>
        
        {/* Botones de acción */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={enviando}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            {enviando ? "Guardando..." : "Guardar CD"}
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