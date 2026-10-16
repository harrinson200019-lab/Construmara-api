
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la API.
app.use(cors());
app.use(express.json());

// Importar rutas.
const clientesRoutes = require("./routes/clientes");
const proyectosRoutes = require("./routes/proyectos");
const cotizacionesRoutes = require("./routes/cotizaciones");
const materialesRoutes = require("./routes/materiales");
// Ruta principal.
app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "Bienvenido a Construmara API",
        estado: "Funcionando correctamente",
        version: "1.0.0"
    });
});

// Ruta de verificación.
app.get("/api/health", (req, res) => {
    res.status(200).json({
        servicio: "Construmara API",
        estado: "activo"
    });
});

// Rutas de clientes.
app.use("/api/clientes", clientesRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/cotizaciones", cotizacionesRoutes);
app.use("/api/materiales", materialesRoutes);
// Iniciar servidor.
app.listen(PORT, () => {
    console.log(
        `Construmara API ejecutándose en http://localhost:${PORT}`
    );
});
