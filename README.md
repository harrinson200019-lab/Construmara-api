# Construmara API

## 1. Descripción del proyecto

Construmara API es un servicio web REST desarrollado para apoyar la gestión de una empresa dedicada a actividades de construcción y remodelación.

El sistema permite administrar información relacionada con clientes, proyectos, cotizaciones y materiales mediante servicios web que utilizan el formato JSON para el intercambio de datos.

## 2. Objetivo

Desarrollar una API REST que facilite la gestión de la información de Construmara y permita la comunicación entre diferentes aplicaciones y una base de datos relacional.

## 3. Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express.js:** framework para desarrollar los servicios web.
- **MySQL:** sistema de gestión de bases de datos.
- **mysql2:** controlador para conectar Node.js con MySQL.
- **dotenv:** gestión de variables de entorno.
- **CORS:** configuración del acceso entre diferentes orígenes.
- **Postman:** herramienta para probar los servicios REST.
- **Git y GitHub:** control de versiones y alojamiento del código fuente.

## 4. Módulos del sistema

La API está organizada en cuatro módulos principales:

- **Clientes:** permite registrar, consultar, actualizar y eliminar clientes.
- **Proyectos:** permite gestionar proyectos de construcción y remodelación.
- **Cotizaciones:** permite administrar cotizaciones asociadas a los proyectos.
- **Materiales:** permite gestionar materiales, cantidades y precios unitarios.

## 5. Requisitos para la instalación

Para ejecutar el proyecto se requiere:

- Node.js y npm.
- MySQL, por ejemplo, mediante XAMPP.
- Visual Studio Code u otro editor de código.
- Postman para realizar las pruebas de los servicios.

## 6. Instalación y configuración

1. Clonar el repositorio de GitHub.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Instalar las dependencias con el comando:

   `npm install`

4. Crear la base de datos `construmara_db` en MySQL y configurar las tablas requeridas.
5. Crear un archivo `.env` en la carpeta principal y configurar las variables de conexión a la base de datos.

Ejemplo de configuración:

    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=construmara_db
    DB_PORT=3306

**Nota:** la contraseña debe corresponder a la configuración local de MySQL. No se deben publicar credenciales reales en GitHub.

## 7. Ejecución del proyecto

Para iniciar el servidor en modo de desarrollo, ejecutar:

    npm run dev

La API estará disponible localmente en:

http://localhost:3000

Para comprobar el funcionamiento general, se puede consultar:

- `GET /`
- `GET /api/health`

## 8. Endpoints de la API REST

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| GET | `/api/clientes` | Consultar clientes |
| GET | `/api/clientes/:id` | Consultar un cliente por ID |
| POST | `/api/clientes` | Registrar un cliente |
| PUT | `/api/clientes/:id` | Actualizar un cliente |
| DELETE | `/api/clientes/:id` | Eliminar un cliente |
| GET | `/api/proyectos` | Consultar proyectos |
| POST | `/api/proyectos` | Registrar un proyecto |
| GET | `/api/cotizaciones` | Consultar cotizaciones |
| POST | `/api/cotizaciones` | Registrar una cotización |
| GET | `/api/materiales` | Consultar materiales |
| POST | `/api/materiales` | Registrar un material |

Los módulos de proyectos, cotizaciones y materiales también cuentan con operaciones de actualización y eliminación. Los endpoints individuales utilizan el identificador correspondiente.

## 9. Pruebas

Los servicios se pueden probar mediante Postman, utilizando los métodos HTTP correspondientes y enviando los datos en formato JSON cuando sea necesario.

Se recomienda verificar las respuestas del servidor, los códigos de estado HTTP y los cambios realizados en la base de datos.

## 10. Control de versiones

El código fuente se administra mediante Git y se encuentra alojado en GitHub.

**Repositorio:** https://github.com/harrinson200019-lab/Construmara-api

## 11. Conclusión

El desarrollo de Construmara API permite aplicar conocimientos sobre servicios web REST, programación con Node.js y Express, conexión con bases de datos MySQL y pruebas con Postman. Además, el uso de Git y GitHub facilita el control de versiones y la organización del código fuente del proyecto.