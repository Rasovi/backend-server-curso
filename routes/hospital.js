var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

// Modelos
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');

// Rutas (u operaciones CRUD)
// Obtener hospitales
app.get('/', (req, resp, next) => {
    Hospital.find({}, 'nombre img usuario')
        .populate('usuario', 'nombre email')
        .skip(Number(req.query.start || 0))
        .limit(5)
        .exec( //Se indica los campos que quiero retornar
            (err, hospitales) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar hospitales',
                        errors: err
                    })
                } else {
                    Hospital.count({}, (err, count) => {
                        resp.status(200).json({
                            ok: true,
                            hospitales: hospitales,
                            total: count
                        });
                    });
                }
            })
});

// Crear hospital
app.post('/', mdAutenticacion.verificaToken, (req, resp) => {
    var body = req.body; //Necesita el body-parser
    // Comprobar que el usuario existe:
    Usuario.findById(body.usuario, (err, usuario) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'El usuario creador del hospital no existe',
                errors: err
            })
        } else {
            // Crear el hospital:
            var hospital = new Hospital({
                nombre: body.nombre,
                img: body.img,
                usuario: body.usuario
            });
            hospital.save((err, hospitalGuardado) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        mensaje: 'Error al guardar el hospital',
                        errors: err
                    })
                } else {
                    resp.status(200).json({
                        ok: true,
                        hospital: hospitalGuardado,
                        // usuarioToken: req.usuario
                    })
                }
            });

        }
    });

});



// Actualizar hospital
app.put('/:id', mdAutenticacion.verificaToken, (req, resp, next) => {
    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            })
        } else {
            if (!hospital) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: `El hospital con el id %id no existe`,
                    errors: { message: 'No existe un hospital con ese ID' }
                })
            }
            // Comprobar que el usuario existe:
            Usuario.findById(body.usuario, (err, usuario) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'El usuario creador del hospital no existe',
                        errors: err
                    })
                } else {
                    // Actualizar datos del hospital:
                    hospital.nombre = body.nombre;
                    hospital.img = body.img;
                    hospital.usuario = body.usuario;
                    hospital.save((err, hospitalGuardado) => {
                        if (err) {
                            return resp.status(400).json({
                                ok: false,
                                mensaje: 'Error al actualizar el hospital',
                                errors: err
                            })
                        }
                        resp.status(200).json({
                            ok: true,
                            hospital: hospitalGuardado
                        })
                    });

                }
            });
        }
    });
});

// Borrar hospital
app.delete('/:id', mdAutenticacion.verificaToken, (req, resp, next) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            })
        }
        if (!hospitalBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: `No existe un hospital con el id: ${id}`,
                errors: err
            })
        }
        resp.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        })
    })
});

module.exports = app;