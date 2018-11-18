const express = require('express')
const app1 = express()

const Usuario = require('../models/usuario')

const bodyParser = require('body-parser')

const bcrypt = require('bcrypt')

const _ = require('underscore')
    // parse application/x-www-form-urlencoded
app1.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app1.use(bodyParser.json())

app1.get('/usuario', function(req, res) {
    let limite = Number(req.query.limite) || 10;
    let desde = Number(req.query.desde) || 0;
    Usuario.find({ estado: true }, ['nombre', 'email', 'img', 'estado', 'role'])
        .limit(limite)
        .skip(desde)
        .exec((err, usuariosDB) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                })
            Usuario.count({ estado: true }, (err, conteo) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                res.json({
                    ok: true,
                    conteo,
                    usuarios: usuariosDB
                })
            })
        })
})

app1.post('/usuario', function(req, res) {
    let body = req.body
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        estado: body.estado,
        google: body.google,
        prueba: body.prueba
    })
    usuario.save((err, usuarioDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app1.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
})

app1.delete('/usuario', function(req, res) {
    let id = req.query.id;
    /*
    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err)
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        if (!usuarioBorrado) {
            return res.status(400)
                .json({
                    ok: false,
                    err: { message: 'Usuario no encontrado' }
                })

        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
    */
    let eliminarUsuario = { estado: false }
    Usuario.findByIdAndUpdate(id, eliminarUsuario, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: true,
                    err
                })
        }
        if (!usuarioDB) {
            return res.status(400)
                .json({
                    ok: false,
                    err: { message: 'Usuario no encontrado' }
                })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})

module.exports = app1;