var express = require('express');
var app = express();

const fileUpload = require('express-fileupload');
var fileSystem = require('fs');

// Modelos
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');

app.use(fileUpload());

app.put('/:tipo/:id', function(req, res) {

    var tipo = req.params.tipo;
    var id = req.params.id;


    if (!req.files || Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó ningún fichero',
            errors: {
                message: 'Debe seleccionar una imagen'
            }
        });
    }

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) === -1) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo no válido',
            errors: {
                message: 'Debe elegir hospitales, médicos o usuarios'
            }
        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    var extensionesValidas = ['png', 'jpg', 'gif', 'bmp', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) === -1) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: {
                message: 'Debe seleccionar una imagen con extensión: ' + extensionesValidas.join(', ')
            }
        });
    }

    // Nombre de archivo personalizado (el que guardare supongo)
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }
    });

    subirPorTipo(tipo, id, nombreArchivo, res);


});

var subirPorTipo = function(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (fileSystem.existsSync(pathViejo)) {
                // fileSystem.unlink(pathViejo);
                fileSystem.unlink(pathViejo, (err) => {
                    // Si no borra el fichero anterior pues no digo na                    
                });

            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                })
            })
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            var pathViejo = './uploads/medicos/' + medico.img;
            if (fileSystem.existsSync(pathViejo)) {
                // fileSystem.unlink(pathViejo);
                fileSystem.unlink(pathViejo, (err) => {
                    // Si no borra el fichero anterior pues no digo na                    
                });

            }
            medico.img = nombreArchivo;
            medico.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de médico actualizada',
                    medico: usuarioActualizado
                })
            })
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            var pathViejo = './uploads/hospitales/' + hospital.img;
            if (fileSystem.existsSync(pathViejo)) {
                // fileSystem.unlink(pathViejo);
                fileSystem.unlink(pathViejo, (err) => {
                    // Si no borra el fichero anterior pues no digo na                    
                });

            }
            hospital.img = nombreArchivo;
            hospital.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: usuarioActualizado
                })
            })
        });
    }
}

module.exports = app;