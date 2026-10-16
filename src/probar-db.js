
const pool = require("./config/db");

async function probarConexion() {
    try {
        const conexion = await pool.getConnection();

        console.log("¡Conexión con MySQL exitosa!");

        const [resultado] = await conexion.query(
            "SELECT DATABASE() AS base_de_datos"
        );

        console.log("Base de datos:", resultado[0].base_de_datos);

        conexion.release();
        await pool.end();
    } catch (error) {
        console.error("Error de conexión:", error.message);
        await pool.end();
        process.exitCode = 1;
    }
}

probarConexion();
