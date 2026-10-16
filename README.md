# Construmara API

## 1. Descripción del proyecto

Construmara API es un servicio web REST desarrollado para apoyar la gestión de una empresa dedicada a actividades de construcción y remodelación.

La API permite administrar información de clientes, proyectos, cotizaciones y materiales mediante solicitudes HTTP y respuestas en formato JSON. Los datos se almacenan en una base de datos relacional MySQL.

## 2. Objetivo

Desarrollar una API REST que facilite la gestión de la información de Construmara, permita realizar operaciones CRUD (crear, consultar, actualizar y eliminar) y establezca la comunicación entre las aplicaciones y la base de datos.

## 3. Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express.js:** framework para desarrollar los servicios web.
- **MySQL:** sistema de gestión de bases de datos.
- **mysql2:** controlador para conectar Node.js con MySQL.
- **dotenv:** administración de variables de entorno.
- **CORS:** configuración del acceso entre diferentes orígenes.
- **Postman:** herramienta para probar los servicios REST.
- **Git:** sistema de control de versiones.
- **GitHub:** plataforma para alojar y compartir el código fuente.

## 4. Módulos del sistema

La API cuenta con cuatro módulos principales:

- **Clientes:** registro, consulta, actualización y eliminación de clientes.
- **Proyectos:** administración de proyectos de construcción y remodelación asociados a clientes.
- **Cotizaciones:** gestión de cotizaciones relacionadas con los proyectos.
- **Materiales:** administración de materiales, cantidades, unidades y precios unitarios.

## 5. Requisitos

Para ejecutar el proyecto se requiere:

- Node.js y npm.
- MySQL. Se puede utilizar XAMPP para administrar el servicio de base de datos.
- Visual Studio Code u otro editor de código.
- Postman para probar los endpoints.
- Git, si se desea clonar y administrar el repositorio.

## 6. Instalación y configuración

### 6.1. Obtener el proyecto

Clonar el repositorio:

```bash
git clone https://github.com/harrinson200019-lab/Construmara-api.git
```

Ingresar a la carpeta:

```bash
cd Construmara-api
```

### 6.2. Instalar dependencias

Ejecutar:

```bash
npm install
```

### 6.3. Crear la base de datos

1. Iniciar MySQL desde XAMPP.
2. Abrir phpMyAdmin en `http://localhost/phpmyadmin`.
3. Importar el archivo `construmara_db.sql`, incluido en el proyecto.
4. Verificar que se haya creado la base de datos `construmara_db` con las tablas `clientes`, `proyectos`, `cotizaciones` y `materiales`.

El archivo SQL contiene la estructura de la base de datos y sus relaciones principales.

### 6.4. Configurar las variables de entorno

Crear un archivo llamado `.env` en la carpeta principal del proyecto con la configuración correspondiente al entorno local:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=construmara_db
DB_PORT=3306
```

**Importante:** ajustar el usuario, la contraseña y el puerto según la instalación local de MySQL. No publicar contraseñas reales ni el archivo `.env` en GitHub.

El archivo `.env.example` sirve como referencia para configurar las variables necesarias.

## 7. Ejecución del proyecto

Para iniciar el servidor en modo de desarrollo:

```bash
npm run dev
```

También se puede iniciar con:

```bash
npm start
```

La API estará disponible localmente en:

`http://localhost:3000`

### Endpoints de verificación

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Verificar el mensaje de bienvenida de la API |
| GET | `/api/health` | Consultar el estado del servicio |

## 8. Endpoints de la API REST

La dirección base para las pruebas locales es:

`http://localhost:3000`

### 8.1. Clientes

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| GET | `/api/clientes` | Consultar todos los clientes |
| GET | `/api/clientes/:id` | Consultar un cliente por identificador |
| POST | `/api/clientes` | Registrar un cliente |
| PUT | `/api/clientes/:id` | Actualizar un cliente |
| DELETE | `/api/clientes/:id` | Eliminar un cliente |

Ejemplo de cuerpo JSON para registrar un cliente:

```json
{
  "nombre": "Juan Pérez",
  "documento": "123456789",
  "telefono": "3001234567",
  "correo": "juan@example.com",
  "direccion": "Corinto, Cauca"
}
```

### 8.2. Proyectos

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| GET | `/api/proyectos` | Consultar los proyectos |
| GET | `/api/proyectos/:id` | Consultar un proyecto por identificador |
| POST | `/api/proyectos` | Registrar un proyecto |
| PUT | `/api/proyectos/:id` | Actualizar un proyecto |
| DELETE | `/api/proyectos/:id` | Eliminar un proyecto |

Los proyectos se relacionan con un cliente mediante `id_cliente`.

Ejemplo de cuerpo JSON:

```json
{
  "id_cliente": 1,
  "nombre": "Remodelación de vivienda",
  "tipo_obra": "Remodelación",
  "descripcion": "Adecuación de espacios interiores",
  "presupuesto": 5000000,
  "estado": "Pendiente",
  "fecha_inicio": "2026-10-20",
  "fecha_fin": "2026-11-20"
}
```

El cliente con identificador `1` debe existir previamente en la base de datos. Las fechas son ejemplos y pueden modificarse para las pruebas.

### 8.3. Cotizaciones

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| GET | `/api/cotizaciones` | Consultar las cotizaciones |
| GET | `/api/cotizaciones/:id` | Consultar una cotización por identificador |
| POST | `/api/cotizaciones` | Registrar una cotización |
| PUT | `/api/cotizaciones/:id` | Actualizar una cotización |
| DELETE | `/api/cotizaciones/:id` | Eliminar una cotización |

Las cotizaciones se relacionan con un proyecto mediante `id_proyecto`.

Ejemplo de cuerpo JSON:

```json
{
  "id_proyecto": 1,
  "fecha": "2026-10-16",
  "descripcion": "Cotización de materiales y mano de obra",
  "total": 2500000,
  "estado": "Borrador"
}
```

El proyecto con identificador `1` debe existir previamente. El valor de `estado` debe corresponder con los valores permitidos por la base de datos: `Borrador`, `Enviada`, `Aprobada` o `Rechazada`.

### 8.4. Materiales

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| GET | `/api/materiales` | Consultar los materiales |
| GET | `/api/materiales/:id` | Consultar un material por identificador |
| POST | `/api/materiales` | Registrar un material |
| PUT | `/api/materiales/:id` | Actualizar un material |
| DELETE | `/api/materiales/:id` | Eliminar un material |

Ejemplo de cuerpo JSON:

```json
{
  "nombre": "Cemento gris",
  "descripcion": "Bulto de cemento para obras de construcción",
  "unidad": "bulto",
  "cantidad": 50,
  "precio_unitario": 38000
}
```

**Nota:** los endpoints individuales utilizan el identificador del registro. Las operaciones de eliminación pueden estar restringidas cuando existen registros relacionados.

## 9. Pruebas con Postman

El proyecto incluye la colección exportada:

`Construmara-API.postman_collection.json`

Para utilizarla:

1. Abrir Postman.
2. Seleccionar la opción para importar una colección.
3. Elegir el archivo `Construmara-API.postman_collection.json`.
4. Iniciar el servidor de Construmara API.
5. Ejecutar las solicitudes de los módulos Clientes, Proyectos, Cotizaciones y Materiales.

Para las solicitudes POST y PUT, seleccionar el tipo de contenido JSON (`application/json`) y enviar un cuerpo válido cuando corresponda.

Se recomienda verificar las respuestas HTTP, los datos devueltos por el servidor y los cambios en la base de datos. Para probar las relaciones, registrar primero un cliente, después un proyecto y finalmente una cotización asociada al proyecto.

## 10. Control de versiones

El proyecto utiliza Git para registrar los cambios del código fuente y GitHub para alojar el repositorio remoto.

**Repositorio oficial:**

https://github.com/harrinson200019-lab/Construmara-api

## 11. Estructura principal del proyecto

```text
Construmara-api/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── clientes.js
│   │   ├── proyectos.js
│   │   ├── cotizaciones.js
│   │   └── materiales.js
│   ├── probar-db.js
│   └── server.js
├── .env.example
├── .gitignore
├── Construmara-API.postman_collection.json
├── construmara_db.sql
├── package.json
├── package-lock.json
└── README.md
```

## 12. Conclusión

Construmara API permite aplicar conocimientos de desarrollo de servicios web REST, programación con Node.js y Express, conexión con MySQL y pruebas mediante Postman. La documentación de los endpoints y el uso de Git y GitHub facilitan el mantenimiento, la trazabilidad de los cambios y la consulta del código fuente del proyecto.