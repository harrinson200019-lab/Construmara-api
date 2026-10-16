
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET: consultar todas las cotizaciones.
router.get("/", async (req, res) => {
    try {
        const [cotizaciones] = await pool.execute(`
            SELECT c.*, p.nombre AS nombre_proyecto
            FROM cotizaciones c
            INNER JOIN proyectos p ON c.id_proyecto = p.id_proyecto
            ORDER BY c.id_cotizacion DESC
        `);

        res.status(200).json(cotizaciones);
    } catch (error) {
        console.error("Error al consultar cotizaciones:", error.message);
        res.status(500).json({
            mensaje: "Error al consultar las cotizaciones"
        });
    }
});

// GET: consultar una cotización por su ID.
router.get("/:id", async (req, res) => {
    try {
        const [cotizaciones] = await pool.execute(`
            SELECT c.*, p.nombre AS nombre_proyecto
            FROM cotizaciones c
            INNER JOIN proyectos p ON c.id_proyecto = p.id_proyecto
            WHERE c.id_cotizacion = ?
        `, [req.params.id]);

        if (cotizaciones.length === 0) {
            return res.status(404).json({
                mensaje: "Cotización no encontrada"
            });
        }

        res.status(200).json(cotizaciones[0]);
    } catch (error) {
        console.error("Error al consultar cotización:", error.message);
        res.status(500).json({
            mensaje: "Error al consultar la cotización"
        });
    }
});

// POST: registrar una cotización.
router.post("/", async (req, res) => {
    const { id_proyecto, fecha, descripcion, total, estado } = req.body;

    if (!id_proyecto || !fecha) {
        return res.status(400).json({
            mensaje: "El proyecto y la fecha son obligatorios"
        });
    }

    try {
        const [resultado] = await pool.execute(`
            INSERT INTO cotizaciones
                (id_proyecto, fecha, descripcion, total, estado)
            VALUES (?, ?, ?, ?, ?)
        `, [
            id_proyecto,
            fecha,
            descripcion || null,
            total ?? 0,
            estado || "Borrador"
        ]);

        res.status(201).json({
            mensaje: "Cotización registrada correctamente",
            id_cotizacion: resultado.insertId
        });
    } catch (error) {
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                mensaje: "El proyecto indicado no existe"
            });
        }

        console.error("Error al registrar cotización:", error.message);
        res.status(500).json({
            mensaje: "Error al registrar la cotización"
        });
    }
});

// PUT: actualizar una cotización.
router.put("/:id", async (req, res) => {
    const { id_proyecto, fecha, descripcion, total, estado } = req.body;

    if (!id_proyecto || !fecha) {
        return res.status(400).json({
            mensaje: "El proyecto y la fecha son obligatorios"
        });
    }

    try {
        const [resultado] = await pool.execute(`
            UPDATE cotizaciones
            SET id_proyecto = ?, fecha = ?, descripcion = ?,
                total = ?, estado = ?
            WHERE id_cotizacion = ?
        `, [
            id_proyecto,
            fecha,
            descripcion || null,
            total ?? 0,
            estado || "Borrador",
            req.params.id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Cotización no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Cotización actualizada correctamente"
        });
    } catch (error) {
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                mensaje: "El proyecto indicado no existe"
            });
        }

        console.error("Error al actualizar cotización:", error.message);
        res.status(500).json({
            mensaje: "Error al actualizar la cotización"
        });
    }
});

// DELETE: eliminar una cotización.
router.delete("/:id", async (req, res) => {
    try {
        const [resultado] = await pool.execute(
            "DELETE FROM cotizaciones WHERE id_cotizacion = ?",
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Cotización no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Cotización eliminada correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar cotización:", error.message);
        res.status(500).json({
            mensaje: "Error al eliminar la cotización"
        });
    }
});

module.exports = router;
