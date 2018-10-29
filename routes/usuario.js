var express = require('express');
var app = express();

var Usuario = require('../models/usuario');
var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

// Rutas
app.get('/', (req, resp, next) => {
    Usuario.find({}, 'nombre email img role').exec( //Se indica los campos que quiero retornar
        (err, usuarios) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar usuarios',
                    errors: err
                })
            } else {
                resp.status(200).json({
                    ok: true,
                    usuarios: usuarios
                })
            }
        })
});



// Crear usuario
app.post('/', mdAutenticacion.verificaToken, (req, resp) => {
    var body = req.body; //Necesita el body-parser
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al guardar el usuario',
                errors: err
            })
        } else {
            resp.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            })
        }
    });
});



// Actualizar usuario
app.put('/:id', mdAutenticacion.verificaToken, (req, resp, next) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            })
        } else {
            if (!usuario) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: `El usuario con el id %id no existe`,
                    errors: { message: 'No existe un usuario con ese ID' }
                })
            }
            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;
            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar el usuario',
                        errors: err
                    })
                }
                usuarioGuardado.password = 'No te lo voy a deciiir jeje';
                resp.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado
                })
            });

        }
    });
});

// Borrar usuario
app.delete('/:id', mdAutenticacion.verificaToken, (req, resp, next) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            })
        }
        if (!usuarioBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: `No existe un usuario con el id: ${id}`,
                errors: err
            })
        }
        resp.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
});

module.exports = app;