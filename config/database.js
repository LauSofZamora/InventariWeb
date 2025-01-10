const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
});

db.getConnection()
    .then(() => {
        console.log('Conexión exitosa a MySQL.');
    })
    .catch(err => {
        console.error('Error al conectar con MySQL:', err.message);
    });

module.exports = db;
