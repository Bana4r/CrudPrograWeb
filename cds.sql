-- Crear base de datos
CREATE DATABASE IF NOT EXISTS cds;
USE cds;

-- Tabla: artistas
CREATE TABLE IF NOT EXISTS artistas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL
);

-- Datos: artistas
INSERT INTO artistas (id, nombre) VALUES
  (7, 'hola'),
  (8, 'hola'),
  (10, 'holaa');

-- Tabla: cds
CREATE TABLE IF NOT EXISTS cds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  artista_id INT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE CASCADE
);

-- Datos: cds
INSERT INTO cds (id, titulo, artista_id, precio, stock) VALUES
  (5, 'q2e', 7, 22.00, 2);

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  `1er_apellido` VARCHAR(50),
  `2do_apellido` VARCHAR(50),
  usuario VARCHAR(50),
  contrasenia VARCHAR(50),
  tipo_usuario ENUM('admin','user')
);

-- Datos: usuarios
INSERT INTO usuarios (id, nombre, `1er_apellido`, `2do_apellido`, usuario, contrasenia, tipo_usuario) VALUES
  (1, 'Jose Alberto', 'Velix', 'Callejas', 'Beto', '12345678', 'admin'),
  (2, 'Carlos', NULL, NULL, 'Carl', '87654321', 'user');

-- Tabla: ventas
CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cd_id INT,
  cantidad INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (cd_id) REFERENCES cds(id) ON DELETE CASCADE
);
