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

        let Producto = new models.Producto()
        Producto.titulo = req.body.titulo
        Producto.valor = req.body.valor
        Producto.nombre = req.body.nombre
        Producto.descripcion = req.body.descripcion
        Producto.data = req.file.buffer

        Producto.save((err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else res.status(200).json({
                err: err,
                data: 'Producto Creado Correctamente.'
            })
        })
    },
    newCat: (req, res) => {
        let Categoria = new models.Categoria()
        Categoria.titulo = req.body.titulo
        Categoria.active = req.body.active

        Categoria.save((err, data) => {
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
    newTag: (req, res) => {
        let Tag = new models.Tag()
        Tag.titulo = req.body.titulo
        Tag.active = req.body.active

        Tag.save((err, data) => {
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
    newColor: (req, res) => {
        let Color = new models.Color()
        Color.titulo = req.body.titulo
        Color.active = req.body.active
        Color.primario = req.body.primario
        Color.segundario = req.body.segundario

        Color.save((err, data) => {
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
    getColor: (req, res) => {
        models.Color.find({}, (err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else res.status(200).json({
                err: err,
                data: data
            })
        });
    },
    getCat: (req, res) => {
        models.Categoria.find({}, (err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else res.status(200).json({
                err: err,
                data: data
            })
        });
    },

    getTag: (req, res) => {
        models.Tag.find({}, (err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else res.status(200).json({
                err: err,
                data: data
            })
        });
    },
    updTag: (req, res) => {
        let titulo = req.body.titulo
        let active = req.body.active
        models.Tag.update({ titulo: titulo }, { active: active }, (err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else res.status(200).json({
                err: err,
                data: data
            })
        });
    },
    updCat: (req, res) => {
        let titulo = req.body.titulo
        let active = req.body.active
        models.Categoria.update({ titulo: titulo }, { active: active }, (err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else res.status(200).json({
                err: err,
                data: data
            })
        });
    },
    updColor: (req, res) => {
        let titulo = req.body.titulo
        let active = req.body.active
        models.Color.update({ titulo: titulo }, { active: active }, (err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else res.status(200).json({
                err: err,
                data: data
            })
        });
    }
}