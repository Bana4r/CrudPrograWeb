import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db'; // Changed from 'query' to 'executeQuery'

// Named export for GET method - this is required by Next.js API routes
export async function GET() {
  try {
    const result = await executeQuery('SELECT * FROM artistas', []); // Changed from query to executeQuery
    return NextResponse.json({ artistas: result.rows });
  } catch (error) {
    console.error('Error al obtener artistas:', error);
    return NextResponse.json(
      { error: 'Error al obtener artistas' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
    try {
      const { nombre } = await request.json();
      
      if (!nombre || nombre.trim() === '') {
        return NextResponse.json(
          { error: 'El nombre del artista es obligatorio' },
          { status: 400 }
        );
      }
      
      const result = await executeQuery(
        'INSERT INTO artistas (nombre) VALUES (?)',
        [nombre]
      );
      
      // Para INSERT, mysql2 devuelve un objeto con propiedades como insertId
      const insertId = result.rows.insertId;
      
      if (insertId) {
        const insertedArtista = await executeQuery(
          'SELECT * FROM artistas WHERE id = ?', 
          [insertId]
        );
        
        if (insertedArtista.rows.length > 0) {
          return NextResponse.json({ artista: insertedArtista.rows[0] }, { status: 201 });
        }
      }
      
      return NextResponse.json({ success: true, message: 'Artista creado correctamente' }, { status: 201 });
    } catch (error) {
      console.error('Error al crear artista:', error);
      return NextResponse.json(
        { error: 'Error al crear artista: ' + error.message },
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
          { error: 'Se requiere ID del artista' },
          { status: 400 }
        );
      }
      
      // Verificar si el artista está siendo utilizado en la tabla de CDs
      const checkResult = await executeQuery(
        'SELECT COUNT(*) as count FROM cds WHERE artista_id = ?',
        [id]
      );
      
      // Si el artista está siendo utilizado, no permitir la eliminación
      if (checkResult.rows[0].count > 0) {
        return NextResponse.json(
          { 
            error: 'No se puede eliminar este artista porque tiene CDs asociados', 
            inUse: true,
            count: checkResult.rows[0].count 
          },
          { status: 409 } // Conflict status code
        );
      }
      
      // Si no está siendo utilizado, proceder con la eliminación
      const result = await executeQuery(
        'DELETE FROM artistas WHERE id = ?',
        [id]
      );
      
      if (result.rows.affectedRows > 0) {
        return NextResponse.json({ success: true, message: 'Artista eliminado correctamente' });
      } else {
        return NextResponse.json(
          { error: 'No se encontró el artista con el ID proporcionado' },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error('Error al eliminar artista:', error);
      return NextResponse.json(
        { error: 'Error al eliminar artista: ' + error.message },
        { status: 500 }
      );
    }
  }