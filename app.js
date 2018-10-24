// Requires
var express = require('express');
var mongoose = require('mongoose');





// Inicialización de variables
var app = express();


// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;
    else {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', ' conectada');
    }
});

// Rutas
app.get('/', (req, resp, next) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'Peticiónnn realizada correctamente'
    })
})



// Arrancar el servidor para escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', ' iniciado');
})