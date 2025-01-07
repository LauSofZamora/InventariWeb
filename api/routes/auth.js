const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../config/database'); // Importar conexión a la base de datos

// Ruta para registro de usuario
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        if (!nombre || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)';
        db.query(query, [nombre, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error al registrar usuario' });
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;

//Ruta para inicio de sesión
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Verifica que los campos estén completos
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
    }

    // Busca al usuario en la base de datos
    const query = "SELECT * FROM usuarios WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Error del servidor." });

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "Correo electrónico o contraseña incorrectos." });
        }

        const user = results[0];

        // Verifica la contraseña
        const isMatch = await bcrypt.compare(password, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Correo electrónico o contraseña incorrectos." });
        }

        // Genera un token JWT
        const token = jwt.sign({ id: user.id_usuario }, "tu_secreto", { expiresIn: "1h" });

        // Responde con el token
        res.json({ success: true, message: "Inicio de sesión exitoso.", token });
    });
});
