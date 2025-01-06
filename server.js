const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true  // Permite multiples comandos

});

// // Leer y ejecutar el archivo schema.sql
const schemaPath = path.join(__dirname, 'database', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Conectar a la BD
db.connect(err => {
    if (err) {
        console.error('Error al conectar con MySQL:', err.message);
        return;
    }
    console.log('Conexión exitosa a MySQL.');

    db.query(schema, (err, result) => {
        if (err) {
            console.error('Error al ejecutar el esquema:', err.message);
            return;
        }
        console.log('Esquema de base de datos ejecutado correctamente.');
    });
});

