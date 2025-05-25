import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(request) {
  try {
    const { usuario, contraseña, rememberMe } = await request.json();

    if (!usuario || !contraseña) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Consulta con BINARY para hacer la comparación sensible a mayúsculas/minúsculas
    const query = `
      SELECT id, nombre, \`1er_apellido\`, \`2do_apellido\`, usuario, tipo_usuario 
      FROM usuarios 
      WHERE BINARY usuario = ? AND BINARY contraseña = ?
    `;

    const result = await executeQuery(query, [usuario, contraseña]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Crear la respuesta
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        primerApellido: user['1er_apellido'],
        segundoApellido: user['2do_apellido'],
        usuario: user.usuario,
        tipoUsuario: user.tipo_usuario
      }
    });

    // Establecer cookies seguras
    const userData = JSON.stringify({
      id: user.id,
      nombre: user.nombre,
      primerApellido: user['1er_apellido'],
      segundoApellido: user['2do_apellido'],
      usuario: user.usuario,
      tipoUsuario: user.tipo_usuario
    });

    // Configurar la duración de la cookie basada en rememberMe
    const cookieOptions = {
      httpOnly: false, // Permitir acceso desde JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    };

    if (rememberMe) {
      // Si "Recordarme" está activo: 30 días
      cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 días en segundos
    } else {
      // Si "Recordarme" NO está activo: cookie de sesión (se elimina al cerrar navegador)
      // No incluir maxAge para que sea una cookie de sesión
    }

    response.cookies.set('user-session', userData, cookieOptions);

    return response;

  } catch (error) {
    console.error('Error en autenticación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}