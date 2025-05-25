import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(request) {
  try {
    const { nombre, primerApellido, segundoApellido, usuario, contraseña, tipoUsuario } = await request.json();

    // Validaciones del servidor
    if (!nombre || !nombre.trim()) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio' },
        { status: 400 }
      );
    }

    if (!primerApellido || !primerApellido.trim()) {
      return NextResponse.json(
        { error: 'El primer apellido es obligatorio' },
        { status: 400 }
      );
    }

    if (!usuario || !usuario.trim()) {
      return NextResponse.json(
        { error: 'El nombre de usuario es obligatorio' },
        { status: 400 }
      );
    }

    if (!contraseña || contraseña.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await executeQuery(
      'SELECT id FROM usuarios WHERE usuario = ?',
      [usuario.trim()]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya está en uso' },
        { status: 409 }
      );
    }

    // Insertar el nuevo usuario
    const result = await executeQuery(
      'INSERT INTO usuarios (nombre, `1er_apellido`, `2do_apellido`, usuario, contraseña, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?)',
      [
        nombre.trim(),
        primerApellido.trim(),
        segundoApellido ? segundoApellido.trim() : null,
        usuario.trim(),
        contraseña,
        'user'
      ]
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'Usuario registrado exitosamente',
        userId: result.rows.insertId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}