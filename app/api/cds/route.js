import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const query = `
      SELECT c.id, c.titulo, c.precio, c.stock, a.id AS artista_id, a.nombre AS artista_nombre
      FROM cds c
      JOIN artistas a ON c.artista_id = a.id
      ORDER BY c.titulo
    `;
    
    // Change how we call executeQuery - pass query and empty array directly
    const result = await executeQuery(query, []);
    
    // Convert price to proper number format
    const cds = result.rows.map(cd => ({
      ...cd,
      precio: parseFloat(cd.precio)
    }));
    
    return NextResponse.json({ cds });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { titulo, artista_id, precio, stock } = await request.json();
    
    // Validaciones básicas en el servidor
    if (!titulo || titulo.trim() === '') {
      return NextResponse.json(
        { error: 'El título del CD es obligatorio' },
        { status: 400 }
      );
    }
    
    if (!artista_id) {
      return NextResponse.json(
        { error: 'El artista es obligatorio' },
        { status: 400 }
      );
    }
    
    if (!precio || precio <= 0) {
      return NextResponse.json(
        { error: 'El precio debe ser un número positivo' },
        { status: 400 }
      );
    }
    
    if (stock < 0) {
      return NextResponse.json(
        { error: 'El stock no puede ser negativo' },
        { status: 400 }
      );
    }
    
    // Verificar que el artista existe
    const artistaCheck = await executeQuery(
      'SELECT id FROM artistas WHERE id = ?',
      [artista_id]
    );
    
    if (artistaCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'El artista seleccionado no existe' },
        { status: 404 }
      );
    }
    
    // Insertar el CD en la base de datos
    const result = await executeQuery(
      'INSERT INTO cds (titulo, artista_id, precio, stock) VALUES (?, ?, ?, ?)',
      [titulo, artista_id, precio, stock]
    );
    
    // Obtener el ID del CD recién insertado
    const insertId = result.rows.insertId;
    
    if (insertId) {
      // Obtener el CD insertado con los datos del artista
      const insertedCD = await executeQuery(
        `SELECT c.id, c.titulo, c.precio, c.stock, a.id AS artista_id, a.nombre AS artista_nombre
         FROM cds c
         JOIN artistas a ON c.artista_id = a.id
         WHERE c.id = ?`,
        [insertId]
      );
      
      if (insertedCD.rows.length > 0) {
        const cd = {
          ...insertedCD.rows[0],
          precio: parseFloat(insertedCD.rows[0].precio)
        };
        
        return NextResponse.json(
          { success: true, message: 'CD creado correctamente', cd },
          { status: 201 }
        );
      }
    }
    
    return NextResponse.json(
      { success: true, message: 'CD creado correctamente' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear CD:', error);
    return NextResponse.json(
      { error: 'Error al crear CD: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere ID del CD' },
        { status: 400 }
      );
    }
    
    // Verificar que el CD existe antes de intentar eliminarlo
    const checkCD = await executeQuery(
      'SELECT id FROM cds WHERE id = ?',
      [id]
    );
    
    if (checkCD.rows.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró el CD con el ID proporcionado' },
        { status: 404 }
      );
    }
    
    // Proceder con la eliminación
    const result = await executeQuery(
      'DELETE FROM cds WHERE id = ?',
      [id]
    );
    
    if (result.rows.affectedRows > 0) {
      return NextResponse.json({ 
        success: true,
        message: 'CD eliminado correctamente'
      });
    } else {
      return NextResponse.json(
        { error: 'No se pudo eliminar el CD' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error al eliminar CD:', error);
    return NextResponse.json(
      { error: 'Error al eliminar CD: ' + error.message },
      { status: 500 }
    );
  }
}