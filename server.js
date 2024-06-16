const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'danielyeray5',
    database: 'rfid_db'
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para el registro de usuario
// Ruta para el registro de usuario
app.post('/registro', (req, res) => {
    const { nombreUsuario, rfid, correo, contraseña } = req.body; // Agregamos contraseña aquí
    const checkSql = 'SELECT * FROM usuarios WHERE rfid = ? OR nombre = ?';
    db.query(checkSql, [rfid, nombreUsuario], (err, results) => {
        if (err) {
            console.error('Error al consultar en la base de datos:', err);
            res.status(500).send('Error al registrar usuario');
        } else if (results.length > 0) {
            res.status(400).send('Usuario ya registrado');
        } else {
            const sql = 'INSERT INTO usuarios (rfid, nombre, correo, contraseña) VALUES (?, ?, ?, ?)';
            db.query(sql, [rfid, nombreUsuario, correo, contraseña], (err, result) => {
                if (err) {
                    console.error('Error al insertar en la base de datos:', err);
                    res.status(500).send('Error al registrar usuario');
                } else {
                    res.send('Usuario registrado');
                }
            });
        }
    });
});


// Ruta para iniciar sesión
app.post('/iniciarSesion', (req, res) => {
    const { rfid, nombreUsuario } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE rfid = ? AND nombre = ?';
    db.query(sql, [rfid, nombreUsuario], (err, results) => {
        if (err) {
            console.error('Error al consultar en la base de datos:', err);
            res.status(500).send('Error al iniciar sesión');
        } else if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
