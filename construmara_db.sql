
-- =====================================================
-- PROYECTO: CONSTRUMARA API
-- Base de datos: construmara_db
-- Motor: MySQL
-- =====================================================

CREATE DATABASE IF NOT EXISTS construmara_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE construmara_db;

-- 1. TABLA: CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(30) NOT NULL,
    telefono VARCHAR(20) DEFAULT NULL,
    correo VARCHAR(120) DEFAULT NULL,
    direccion VARCHAR(200) DEFAULT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_cliente),
    UNIQUE KEY uk_clientes_documento (documento)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- 2. TABLA: PROYECTOS
CREATE TABLE IF NOT EXISTS proyectos (
    id_proyecto INT(11) NOT NULL AUTO_INCREMENT,
    id_cliente INT(11) NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    tipo_obra VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    presupuesto DECIMAL(12,2) DEFAULT 0.00,
    estado ENUM(
        'Pendiente',
        'En proceso',
        'Finalizado',
        'Cancelado'
    ) DEFAULT 'Pendiente',
    fecha_inicio DATE DEFAULT NULL,
    fecha_fin DATE DEFAULT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_proyecto),
    KEY idx_proyectos_cliente (id_cliente),
    CONSTRAINT fk_proyectos_clientes
        FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- 3. TABLA: COTIZACIONES
CREATE TABLE IF NOT EXISTS cotizaciones (
    id_cotizacion INT(11) NOT NULL AUTO_INCREMENT,
    id_proyecto INT(11) NOT NULL,
    fecha DATE NOT NULL,
    descripcion TEXT DEFAULT NULL,
    total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    estado ENUM(
        'Borrador',
        'Enviada',
        'Aprobada',
        'Rechazada'
    ) DEFAULT 'Borrador',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_cotizacion),
    KEY idx_cotizaciones_proyecto (id_proyecto),
    CONSTRAINT fk_cotizaciones_proyectos
        FOREIGN KEY (id_proyecto)
        REFERENCES proyectos (id_proyecto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- 4. TABLA: MATERIALES
CREATE TABLE IF NOT EXISTS materiales (
    id_material INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    unidad VARCHAR(30) NOT NULL DEFAULT 'unidad',
    cantidad DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    precio_unitario DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    fecha_actualizacion TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_material)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;
