const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/authMiddleware');

// Controlador para registrar productos
router.post('/register', verifyToken, async (req, res) => {
    const { nombre, caracteristicas, precio, cantidad, imagen } = req.body;
    const userId = req.user.id;

    if (!nombre || !precio || !cantidad) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    try {
        const query = 'INSERT INTO productos (id_usuario, nombre, caracteristicas, precio, cantidad, imagen) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(query, [userId, nombre, caracteristicas, precio, cantidad, imagen]);
        res.status(201).json({ message: 'Producto registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar producto', error: err.message });
    }
});

// Ruta para obtener los productos por usuario
router.get('/', verifyToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const query = 'SELECT * FROM productos WHERE id_usuario = ?';
        const [products] = await db.query(query, [userId]);
        res.status(200).json({ productos: products });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener productos', error: err.message });
    }
});

// Ruta para actualizar un producto
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nombre, caracteristicas, precio, cantidad, imagen } = req.body;
    const userId = req.user.id;

    if (!nombre || !precio || !cantidad) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    try {
        const query = 'UPDATE productos SET nombre = ?, caracteristicas = ?, precio = ?, cantidad = ?, imagen = ? WHERE id_producto = ? AND id_usuario = ?';
        const [result] = await db.query(query, [nombre, caracteristicas, precio, cantidad, imagen, id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado o no autorizado.' });
        }

        res.status(200).json({ message: 'Producto actualizado exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el producto.', error: err.message });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_usuario = ?';
        const [products] = await db.query(query, [id, userId]);

        if (products.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado o no autorizado.' });
        }

        res.status(200).json(products[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el producto.', error: err.message });
    }
});

module.exports = router;
