let models = require('./models')
let con = require('./config')
let jwt = require('jsonwebtoken')
module.exports = {
    nuevoUsuario: (req, res) => {
        let User = new models.Usuario()
        User.usuario = req.body.usuario
        User.cedula = req.body.cedula
        User.nombre = req.body.nombre
        User.apellido = req.body.apellido
        User.correo = req.body.correo
        User.telefono = req.body.telefono
        User.password = req.body.password

        User.save((err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else res.status(200).json({
                err: err,
                data: data
            })
        })
    },
    auth: (req, res) => {
        let token = req.headers['access-token']

        if (token) jwt.verify(token, con.conf.key, (err, decoded) => {
            if (err) res.status(400).json({
                err: err,
                data: decoded || null
            })
            else res.status(200).json({
                err: err,
                data: decoded
            })
        });


    },
    logIn: (req, res) => {

        let usu = req.body.usuario
        let pass = req.body.password

        models.Usuario.findOne({ usuario: usu, password: pass }, (err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else {

                if (data) jwt.sign({ expiresIn: "30d" }, con.conf.key, (err, tk) => {
                    if (err) res.status(400).json({
                        err: err,
                        data: data || null
                    })
                    else res.status(200).json({
                        err: err,
                        data: tk
                    })
                })
                else res.status(401).json({
                    err: { msg: 'Clave o usario incorrectos' },
                    data: data || null
                })

            }
        })
    },
    newProd: (req, res) => {

        let usu = req.body.usuario
        let pass = req.body.password
        console.log(req.body)
        if (err) res.status(400).json({
            err: 'err',
            data: 'data' || null
        })
        else res.status(200).json({
            err: 'err',
            data: 'tk'
        })

        /* models.Usuario.findOne({ usuario: usu, password: pass }, (err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else {

                if (data) jwt.sign({ expiresIn: "30d" }, con.conf.key, (err, tk) => {
                    if (err) res.status(400).json({
                        err: err,
                        data: data || null
                    })
                    else res.status(200).json({
                        err: err,
                        data: tk
                    })
                })
                else res.status(401).json({
                    err: { msg: 'Clave o usario incorrectos' },
                    data: data || null
                })

            }
        }) */
    }
}