var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


// Verificar token (esto se tiene que colocar aqui, antes de las operaciones de crear, actualizar ...)

exports.verificaToken = function(req, resp, next) {
    var token = req.query.token; //query guarda los parametros de ? o &
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return resp.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            })
        }
        req.usuario = decoded.usuario;
        next(); //next permite continuar con la creacion o lo que se este usando
    })
}