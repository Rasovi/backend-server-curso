var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

// Modelos
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');

// Rutas (u operaciones CRUD)
// Obtener medicos
app.get('/', (req, resp, next) => {
    Medico.find({}, 'nombre img usuario hospital')
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre usuario')
        .skip(Number(req.query.start || 0))
        .limit(5)
        .exec( //Se indica los campos que quiero retornar
            (err, medicos) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar medicos',
                        errors: err
                    })
                } else {
                    Medico.count({}, (err, count) => {
                        resp.status(200).json({
                            ok: true,
                            medicos: medicos,
                            total: count
                        })
                    });
                }
            })
});

// Crear medico
app.post('/', mdAutenticacion.verificaToken, (req, resp) => {
    var body = req.body; //Necesita el body-parser
    // Comprobar que el usuario existe:
    Usuario.findById(body.usuario, (err, usuario) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'El usuario creador del registro medico no existe',
                errors: err
            })
        } else {
            //FALTA: Buscar hospital
            Hospital.findById(body.hospital, (err, hospital) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'No se ha encontrado el hospital asignado al médico',
                        errors: err
                    })
                } else {
                    // Crear el medico:
                    var medico = new Medico({
                        nombre: body.nombre,
                        img: body.img,
                        usuario: body.usuario,
                        hospital: body.hospital
                    });
                    medico.save((err, medicoGuardado) => {
                        if (err) {
                            return resp.status(400).json({
                                ok: false,
                                mensaje: 'Error al guardar el medico',
                                errors: err
                            })
                        } else {
                            resp.status(200).json({
                                ok: true,
                                medico: medicoGuardado,
                                // usuarioToken: req.usuario
                            })
                        }
                    });
                }

            })


        }
    });

});



// Actualizar medico
app.put('/:id', mdAutenticacion.verificaToken, (req, resp, next) => {
    var id = req.params.id;
    var body = req.body;
    Medico.findById(id, (err, medico) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el medico',
                errors: err
            })
        } else {
            if (!medico) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: `El medico con el id ${id} no existe`,
                    errors: { message: 'No existe un medico con ese ID' }
                })
            }
            // Comprobar que el usuario existe:
            Usuario.findById(body.usuario, (err, usuario) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'El usuario creador del registro del medico no existe',
                        errors: err
                    })
                } else {
                    Hospital.findById(body.hospital, (err, hospital) => {
                        if (err) {
                            return resp.status(500).json({
                                ok: false,
                                mensaje: 'No se ha encontrado el hospital asignado al médico',
                                errors: err
                            })
                        }
                        // Actualizar datos del medico:
                        medico.nombre = body.nombre;
                        medico.img = body.img;
                        medico.usuario = body.usuario;
                        medico.hospital = body.hospital;
                        medico.save((err, medicoGuardado) => {
                            if (err) {
                                return resp.status(400).json({
                                    ok: false,
                                    mensaje: 'Error al actualizar el medico',
                                    errors: err
                                })
                            }
                            resp.status(200).json({
                                ok: true,
                                medico: medicoGuardado
                            })
                        });
                    })
                }
            });
        }
    });
});

// Borrar medico
app.delete('/:id', mdAutenticacion.verificaToken, (req, resp, next) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el médico',
                errors: err
            })
        }
        if (!medicoBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: `No existe un hospital con el id: ${id}`,
                errors: err
            })
        }
        resp.status(200).json({
            ok: true,
            medico: medicoBorrado
        })
    })
});

module.exports = app;