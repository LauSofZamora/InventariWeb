require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const db = require('./config/database'); // Configuración de la base de datos
const authRoutes = require('./api/routes/auth'); // Rutas de autenticación

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/auth', authRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
