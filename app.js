// Requires
var express = require('express');
var mongoose = require('mongoose');
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var bodyParser = require('body-parser');


// Inicialización de variables
var app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;
    else {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', ' conectada');
    }
});

// Importacion de ficheros de rutas y asignacion de url
// NOTA: El orden es importante
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);




// Arrancar el servidor para escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', ' iniciado');
});