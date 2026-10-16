
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET: consultar todos los proyectos.
router.get("/", async (req, res) => {
    try {
        const [proyectos] = await pool.execute(`
            SELECT p.*, c.nombre AS nombre_cliente
            FROM proyectos p
            INNER JOIN clientes c ON p.id_cliente = c.id_cliente
            ORDER BY p.id_proyecto DESC
        `);

        res.status(200).json(proyectos);
    } catch (error) {
        console.error("Error al consultar proyectos:", error.message);
        res.status(500).json({
            mensaje: "Error al consultar los proyectos"
        });
    }
});

// GET: consultar un proyecto por su ID.
router.get("/:id", async (req, res) => {
    try {
        const [proyectos] = await pool.execute(`
            SELECT p.*, c.nombre AS nombre_cliente
            FROM proyectos p
            INNER JOIN clientes c ON p.id_cliente = c.id_cliente
            WHERE p.id_proyecto = ?
        `, [req.params.id]);

        if (proyectos.length === 0) {
            return res.status(404).json({
                mensaje: "Proyecto no encontrado"
            });
        }

        res.status(200).json(proyectos[0]);
    } catch (error) {
        console.error("Error al consultar proyecto:", error.message);
        res.status(500).json({
            mensaje: "Error al consultar el proyecto"
        });
    }
});

// POST: registrar un proyecto.
router.post("/", async (req, res) => {
    const {
        id_cliente,
        nombre,
        tipo_obra,
        descripcion,
        presupuesto,
        estado,
        fecha_inicio,
        fecha_fin
    } = req.body;

    if (!id_cliente || !nombre || !tipo_obra) {
        return res.status(400).json({
            mensaje: "El cliente, el nombre y el tipo de obra son obligatorios"
        });
    }

    try {
        const [resultado] = await pool.execute(`
            INSERT INTO proyectos (
                id_cliente, nombre, tipo_obra, descripcion,
                presupuesto, estado, fecha_inicio, fecha_fin
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id_cliente,
            nombre,
            tipo_obra,
            descripcion || null,
            presupuesto ?? 0,
            estado || "Pendiente",
            fecha_inicio || null,
            fecha_fin || null
        ]);

        res.status(201).json({
            mensaje: "Proyecto registrado correctamente",
            id_proyecto: resultado.insertId
        });
    } catch (error) {
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                mensaje: "El cliente indicado no existe"
            });
        }

        console.error("Error al registrar proyecto:", error.message);
        res.status(500).json({
            mensaje: "Error al registrar el proyecto"
        });
    }
});

// PUT: actualizar un proyecto.
router.put("/:id", async (req, res) => {
    const {
        id_cliente,
        nombre,
        tipo_obra,
        descripcion,
        presupuesto,
        estado,
        fecha_inicio,
        fecha_fin
    } = req.body;

    if (!id_cliente || !nombre || !tipo_obra) {
        return res.status(400).json({
            mensaje: "El cliente, el nombre y el tipo de obra son obligatorios"
        });
    }

    try {
        const [resultado] = await pool.execute(`
            UPDATE proyectos
            SET id_cliente = ?, nombre = ?, tipo_obra = ?,
                descripcion = ?, presupuesto = ?, estado = ?,
                fecha_inicio = ?, fecha_fin = ?
            WHERE id_proyecto = ?
        `, [
            id_cliente,
            nombre,
            tipo_obra,
            descripcion || null,
            presupuesto ?? 0,
            estado || "Pendiente",
            fecha_inicio || null,
            fecha_fin || null,
            req.params.id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Proyecto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Proyecto actualizado correctamente"
        });
    } catch (error) {
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                mensaje: "El cliente indicado no existe"
            });
        }

        console.error("Error al actualizar proyecto:", error.message);
        res.status(500).json({
            mensaje: "Error al actualizar el proyecto"
        });
    }
});

// DELETE: eliminar un proyecto.
router.delete("/:id", async (req, res) => {
    try {
        const [resultado] = await pool.execute(
            "DELETE FROM proyectos WHERE id_proyecto = ?",
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Proyecto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Proyecto eliminado correctamente"
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                mensaje: "No se puede eliminar el proyecto porque tiene cotizaciones asociadas"
            });
        }

        console.error("Error al eliminar proyecto:", error.message);
        res.status(500).json({
            mensaje: "Error al eliminar el proyecto"
        });
    }
});

module.exports = router;
