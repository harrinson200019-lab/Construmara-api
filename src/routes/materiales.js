
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET: consultar todos los materiales.
router.get("/", async (req, res) => {
    try {
        const [materiales] = await pool.execute(
            "SELECT * FROM materiales ORDER BY id_material DESC"
        );

        res.status(200).json(materiales);
    } catch (error) {
        console.error("Error al consultar materiales:", error.message);
        res.status(500).json({
            mensaje: "Error al consultar los materiales"
        });
    }
});

// GET: consultar un material por su ID.
router.get("/:id", async (req, res) => {
    try {
        const [materiales] = await pool.execute(
            "SELECT * FROM materiales WHERE id_material = ?",
            [req.params.id]
        );

        if (materiales.length === 0) {
            return res.status(404).json({
                mensaje: "Material no encontrado"
            });
        }

        res.status(200).json(materiales[0]);
    } catch (error) {
        console.error("Error al consultar material:", error.message);
        res.status(500).json({
            mensaje: "Error al consultar el material"
        });
    }
});

// POST: registrar un material.
router.post("/", async (req, res) => {
    const { nombre, descripcion, unidad, cantidad, precio_unitario } = req.body;

    if (!nombre || !unidad) {
        return res.status(400).json({
            mensaje: "El nombre y la unidad del material son obligatorios"
        });
    }

    try {
        const [resultado] = await pool.execute(`
            INSERT INTO materiales
                (nombre, descripcion, unidad, cantidad, precio_unitario)
            VALUES (?, ?, ?, ?, ?)
        `, [
            nombre,
            descripcion || null,
            unidad,
            cantidad ?? 0,
            precio_unitario ?? 0
        ]);

        res.status(201).json({
            mensaje: "Material registrado correctamente",
            id_material: resultado.insertId
        });
    } catch (error) {
        console.error("Error al registrar material:", error.message);
        res.status(500).json({
            mensaje: "Error al registrar el material"
        });
    }
});

// PUT: actualizar un material.
router.put("/:id", async (req, res) => {
    const { nombre, descripcion, unidad, cantidad, precio_unitario } = req.body;

    if (!nombre || !unidad) {
        return res.status(400).json({
            mensaje: "El nombre y la unidad del material son obligatorios"
        });
    }

    try {
        const [resultado] = await pool.execute(`
            UPDATE materiales
            SET nombre = ?, descripcion = ?, unidad = ?,
                cantidad = ?, precio_unitario = ?
            WHERE id_material = ?
        `, [
            nombre,
            descripcion || null,
            unidad,
            cantidad ?? 0,
            precio_unitario ?? 0,
            req.params.id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Material no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Material actualizado correctamente"
        });
    } catch (error) {
        console.error("Error al actualizar material:", error.message);
        res.status(500).json({
            mensaje: "Error al actualizar el material"
        });
    }
});

// DELETE: eliminar un material.
router.delete("/:id", async (req, res) => {
    try {
        const [resultado] = await pool.execute(
            "DELETE FROM materiales WHERE id_material = ?",
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Material no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Material eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar material:", error.message);
        res.status(500).json({
            mensaje: "Error al eliminar el material"
        });
    }
});

module.exports = router;
