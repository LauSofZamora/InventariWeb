const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const router = express.Router();

// Ruta para registro de usuario
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [nombre, email, hashedPassword]);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
    }
});

// Ruta para login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = "SELECT * FROM usuarios WHERE email = ?";
        const [results] = await db.query(query, [email]);

        if (results.length === 0) {
            return res.status(401).json({ message: "Correo electrónico o contraseña incorrectos." });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: "Correo electrónico o contraseña incorrectos." });
        }

        const token = jwt.sign({ id: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, message: "Inicio de sesión exitoso", token });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
});

module.exports = router;
