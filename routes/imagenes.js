var express = require('express');
var app = express();

const path = require('path');
const fileSystem = require('fs');

// Rutas
app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);
    if (fileSystem.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }
});

module.exports = app;