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
    host: 'bhlasd80eymuwk9wtkdp-mysql.services.clever-cloud.com',
    user: 'udcxvrboirbc5kbt', 
    password: 'iXsJc2feC8scBTOhp3Vu',
    database: 'bhlasd80eymuwk9wtkdp'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

app.post('/registro', (req, res) => {
    const { nombreUsuario, rfid, correo, contraseña } = req.body; 
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

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
