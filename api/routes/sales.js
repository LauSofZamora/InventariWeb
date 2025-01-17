const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const verifyToken = require('../middlewares/authMiddleware');

// Registrar una venta
router.post('/register', verifyToken, async (req, res) => {
    const { id_producto, cantidad } = req.body;

    try {
        const [[producto]] = await db.query('SELECT precio, cantidad FROM productos WHERE id_producto = ?', [id_producto]);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        if (producto.cantidad < cantidad) {
            return res.status(400).json({ message: 'Cantidad insuficiente en inventario.' });
        }

        const total = producto.precio * cantidad;

        await db.query('INSERT INTO ventas (id_producto, cantidad, total) VALUES (?, ?, ?)', [id_producto, cantidad, total]);
        await db.query('UPDATE productos SET cantidad = cantidad - ? WHERE id_producto = ?', [cantidad, id_producto]);

        res.status(200).json({ message: 'Venta registrada exitosamente.', total });
    } catch (error) {
        console.error('Error al registrar venta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Obtener todas las ventas
router.get('/', verifyToken, async (req, res) => {
    try {
         let query = `
             SELECT 
                v.cantidad, 
                v.fecha, 
                CAST(v.total AS DECIMAL(10,2)) AS total, 
                p.nombre AS producto, 
                CAST(p.precio AS DECIMAL(10,2)) AS precio
            FROM ventas v 
            INNER JOIN productos p ON v.id_producto = p.id_producto 
            WHERE p.id_usuario = ?
        `;
        const params = [req.user.id];

        if (req.query.minQuantity) {
            query += ` AND v.cantidad >= ?`;
            params.push(req.query.minQuantity);
        }
        if (req.query.maxQuantity) {
            query += ` AND v.cantidad <= ?`;
            params.push(req.query.maxQuantity);
        }
        if (req.query.minTotal) {
            query += ` AND v.total >= ?`;
            params.push(req.query.minTotal);
        }
        if (req.query.maxTotal) {
            query += ` AND v.total <= ?`;
            params.push(req.query.maxTotal);
        }
        if (req.query.startDate) {
            query += ` AND DATE(v.fecha) >= ?`;
            params.push(req.query.startDate);
        }
        if (req.query.endDate) {
            query += ` AND DATE(v.fecha) <= ?`;
            params.push(req.query.endDate);
        }
        if (req.query.products) {
            const products = Array.isArray(req.query.products) ? req.query.products : [req.query.products];
            query += ` AND v.id_producto IN (?)`;
            params.push(products);
        }

        query += ` ORDER BY v.fecha DESC`;

        const [ventas] = await db.query(query, params);
        res.json({ ventas });
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        res.status(500).json({ message: 'Error al obtener las ventas' });
    }
});

// Generar reporte de ventas
router.post('/reports', verifyToken, async (req, res) => {
    const { startDate, endDate, id_producto } = req.body;

    let query = `
        SELECT 
            v.cantidad, 
            v.fecha, 
            CAST(v.total AS DECIMAL(10,2)) AS total, 
            p.nombre AS producto, 
            CAST(p.precio AS DECIMAL(10,2)) AS precio
        FROM ventas v 
        INNER JOIN productos p ON v.id_producto = p.id_producto 
        WHERE DATE(v.fecha) BETWEEN DATE(?) AND DATE(?)
    `;
    const params = [startDate, endDate];

    if (id_producto) {
        query += ' AND v.id_producto = ?';
        params.push(id_producto);
    }

    query += ' ORDER BY v.fecha DESC';

    try {
        const [ventas] = await db.query(query, params);
        res.json({ ventas });
    } catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({ message: 'Error al generar reporte' });
    }
});

module.exports = router;
