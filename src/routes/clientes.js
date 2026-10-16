
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET: consultar todos los clientes.
router.get("/", async (req, res) => {
    try {
        const [clientes] = await pool.execute(
            "SELECT * FROM clientes ORDER BY id_cliente DESC"
        );

        res.status(200).json(clientes);
    } catch (error) {
        console.error("Error al consultar clientes:", error.message);
        res.status(500).json({
            mensaje: "Error al consultar los clientes"
        });
    }
});

// GET: consultar un cliente por su ID.
router.get("/:id", async (req, res) => {
    try {
        const [clientes] = await pool.execute(
            "SELECT * FROM clientes WHERE id_cliente = ?",
            [req.params.id]
        );

        if (clientes.length === 0) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.status(200).json(clientes[0]);
    } catch (error) {
        console.error("Error al consultar cliente:", error.message);
        res.status(500).json({
            mensaje: "Error al consultar el cliente"
        });
    }
});

// POST: registrar un cliente.
router.post("/", async (req, res) => {
    const { nombre, documento, telefono, correo, direccion } = req.body;

    if (!nombre || !documento) {
        return res.status(400).json({
            mensaje: "El nombre y el documento son obligatorios"
        });
    }

    try {
        const [resultado] = await pool.execute(
            `INSERT INTO clientes
             (nombre, documento, telefono, correo, direccion)
             VALUES (?, ?, ?, ?, ?)`,
            [
                nombre,
                documento,
                telefono || null,
                correo || null,
                direccion || null
            ]
        );

        res.status(201).json({
            mensaje: "Cliente registrado correctamente",
            id_cliente: resultado.insertId
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensaje: "Ya existe un cliente con ese documento"
            });
        }

        console.error("Error al registrar cliente:", error.message);
        res.status(500).json({
            mensaje: "Error al registrar el cliente"
        });
    }
});

// PUT: actualizar un cliente.
router.put("/:id", async (req, res) => {
    const { nombre, documento, telefono, correo, direccion } = req.body;

    if (!nombre || !documento) {
        return res.status(400).json({
            mensaje: "El nombre y el documento son obligatorios"
        });
    }

    try {
        const [resultado] = await pool.execute(
            `UPDATE clientes
             SET nombre = ?, documento = ?, telefono = ?,
                 correo = ?, direccion = ?
             WHERE id_cliente = ?`,
            [
                nombre,
                documento,
                telefono || null,
                correo || null,
                direccion || null,
                req.params.id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Cliente actualizado correctamente"
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensaje: "Ya existe un cliente con ese documento"
            });
        }

        console.error("Error al actualizar cliente:", error.message);
        res.status(500).json({
            mensaje: "Error al actualizar el cliente"
        });
    }
});

// DELETE: eliminar un cliente.
router.delete("/:id", async (req, res) => {
    try {
        const [resultado] = await pool.execute(
            "DELETE FROM clientes WHERE id_cliente = ?",
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Cliente eliminado correctamente"
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                mensaje: "No se puede eliminar el cliente porque tiene proyectos asociados"
            });
        }

        console.error("Error al eliminar cliente:", error.message);
        res.status(500).json({
            mensaje: "Error al eliminar el cliente"
        });
    }
});

module.exports = router;
