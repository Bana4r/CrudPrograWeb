"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

interface CD {
  id: number;
  titulo: string;
  artista_nombre: string;
  precio: number;
  stock: number;
}

interface CarritoItem {
  cd: CD;
  cantidad: number;
}

function ClientePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [cds, setCds] = useState<CD[]>([]);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

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

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        setLoggingOut(true);
        await logout();
        router.push('/');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
      } finally {
        setLoggingOut(false);
      }
    }
  };

  const añadirAlCarrito = (cd: CD) => {
    const itemExistente = carrito.find(item => item.cd.id === cd.id);
    
    if (itemExistente) {
      if (itemExistente.cantidad < cd.stock) {
        setCarrito(carrito.map(item =>
          item.cd.id === cd.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ));
      } else {
        alert('No hay suficiente stock disponible');
      }
    } else {
      if (cd.stock > 0) {
        setCarrito([...carrito, { cd, cantidad: 1 }]);
      } else {
        alert('Este CD no está disponible');
      }
    }
  };

  const removerDelCarrito = (cdId: number) => {
    setCarrito(carrito.filter(item => item.cd.id !== cdId));
  };

  const cambiarCantidad = (cdId: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      removerDelCarrito(cdId);
      return;
    }

    const cd = cds.find(c => c.id === cdId);
    if (cd && nuevaCantidad <= cd.stock) {
      setCarrito(carrito.map(item =>
        item.cd.id === cdId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ));
    } else {
      alert('No hay suficiente stock disponible');
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.cd.precio * item.cantidad), 0);
  };

  const cantidadTotalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

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
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de CDs</h1>
          {user && (
            <p className="text-gray-600 mt-1">
              Bienvenido, {user.nombre} {user.primerApellido}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMostrarCarrito(!mostrarCarrito)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.38 2.62A2 2 0 0 0 7.24 18H19M7 13v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
            </svg>
            Carrito ({cantidadTotalItems})
          </button>
          
          {user && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Usuario: {user.usuario}</p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors ${
              loggingOut
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {loggingOut ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cerrando...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </>
            )}
          </button>
        </div>
      </header>

      {isLoading && <p className="text-gray-500 mb-4">Actualizando datos...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Carrito Modal */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Carrito de Compras</h2>
              <button
                onClick={() => setMostrarCarrito(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {carrito.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {carrito.map(item => (
                    <div key={item.cd.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.cd.titulo}</h3>
                        <p className="text-gray-500 text-sm">{item.cd.artista_nombre}</p>
                        <p className="text-green-600 font-bold">${item.cd.precio.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => cambiarCantidad(item.cd.id, item.cantidad - 1)}
                          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        >
                          -
                        </button>
                        <span className="mx-2">{item.cantidad}</span>
                        <button
                          onClick={() => cambiarCantidad(item.cd.id, item.cantidad + 1)}
                          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removerDelCarrito(item.cd.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold">Total: ${calcularTotal().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => alert('Funcionalidad de compra pendiente')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded"
                  >
                    Proceder al Pago
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Catálogo de CDs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cds.length > 0 ? (
          cds.map((cd) => (
            <div key={cd.id} className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">{cd.titulo}</h3>
              <p className="text-gray-600 mb-2">{cd.artista_nombre}</p>
              <p className="text-2xl font-bold text-green-600 mb-2">${cd.precio.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mb-4">
                Stock disponible: {cd.stock}
              </p>
              
              <button
                onClick={() => añadirAlCarrito(cd)}
                disabled={cd.stock === 0}
                className={`w-full font-bold py-2 px-4 rounded ${
                  cd.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {cd.stock === 0 ? 'Sin Stock' : 'Añadir al Carrito'}
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No hay CDs disponibles en el catálogo</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClienteHome() {
  return (
    <ProtectedRoute requiredRole="user">
      <ClientePage />
    </ProtectedRoute>
  );
}