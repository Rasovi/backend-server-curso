var express = require('express');
var app = express();

// Rutas
app.get('/', (req, resp, next) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'Peticiónnn realizada correctamente'
    })
});

module.exports = app;