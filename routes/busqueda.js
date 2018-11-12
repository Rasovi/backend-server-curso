var express = require('express');
var app = express();
// Modelos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Rutas a partir de la indicada en el app.js
app.get('/todo/:busqueda', (req, resp, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); //Para buscar parcialmente y case insensitive
    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(respuestas => {
        resp.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    })
});

app.get('/medico/:busqueda', (req, resp, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); //Para buscar parcialmente y case insensitive
    Promise.all([
        buscarMedicos(busqueda, regex)
    ]).then(respuestas => {
        resp.status(200).json({
            ok: true,
            medicos: respuestas[0]
        });
    })
});

app.get('/hospital/:busqueda', (req, resp, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); //Para buscar parcialmente y case insensitive
    Promise.all([
        buscarHospitales(busqueda, regex)
    ]).then(respuestas => {
        resp.status(200).json({
            ok: true,
            hospitales: respuestas[0]
        });
    })
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, res) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(res);
                }
            });
    });
};

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre usuario')
            .exec((err, res) => {
                if (err) {
                    reject('Error al cargar médicos', err);
                } else {
                    resolve(res);
                }
            })
    });
};

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, res) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(res);
                }
            })
    });
};

module.exports = app;