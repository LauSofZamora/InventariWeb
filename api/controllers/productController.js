const db = require('../../config/database');

// Registrar un producto
const registerProduct = async (req, res) => {
    const { id_usuario } = req.user; 
    const { nombre, caracteristicas, precio, imagen, cantidad } = req.body;

    if (!nombre || !precio || !cantidad) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO productos (id_usuario, nombre, caracteristicas, precio, imagen, cantidad) VALUES (?, ?, ?, ?, ?, ?)',
            [id_usuario, nombre, caracteristicas, precio, imagen, cantidad]
        );

        res.status(201).json({ message: 'Producto registrado exitosamente.', productId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el producto.' });
    }
};

// Consultar productos por usuario
const getProductsByUser = async (req, res) => {
    const { id_usuario } = req.user; 

    try {
        const [products] = await db.query(
            'SELECT * FROM productos WHERE id_usuario = ?',
            [id_usuario]
        );

        res.status(200).json({ productos: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos.' });
    }
};

module.exports = { registerProduct, getProductsByUser };
