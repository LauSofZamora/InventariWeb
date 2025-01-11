const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database');

const authRoutes = require('./api/routes/auth');
const productRoutes = require('./api/routes/products');
const salesRoutes = require('./api/routes/sales');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Rutas para la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ventas', salesRoutes);

// Ruta para servir la página de inicio de sesión (login.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); 
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
