let models = require('./models')
let con = require('./config')
let jwt = require('jsonwebtoken')
let fs = require('fs')
const { model } = require('mongoose')
const { ObjectId } = require('bson')
const e = require('express')
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
        Producto.fileName = req.body.nombre
        Producto.descripcion = req.body.descripcion
        Producto.refVendedora = req.body.refVendedora
        Producto.refInterna = req.body.refInterna
        Producto.stock = req.body.stock
        Producto.color = JSON.parse(req.body.color).map((id) => ObjectId(id))
        Producto.categoria = JSON.parse(req.body.categoria).map((id) => ObjectId(id))
        Producto.tag = JSON.parse(req.body.tag).map((id) => ObjectId(id))
        Producto.talla = JSON.parse(req.body.talla).map((id) => ObjectId(id))
        Producto.pesoImg = req.body.pesoImg
        Producto.img = req.file.buffer

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
    newTalla: (req, res) => {
        let Tag = new models.Talla()
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
    getTalla: (req, res) => {
        models.Talla.find({}, (err, data) => {
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
    updTalla: (req, res) => {
        let titulo = req.body.titulo
        let active = req.body.active
        models.Talla.update({ titulo: titulo }, { active: active }, (err, data) => {
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
    },
    getFile: (req, res) => {
        let id = req.params.prod_id
        models.Producto.find({ _id: ObjectId(id) }, { img: 1, fileName: 1 }, (err, data) => {

            let name = data[0].fileName
            let imgBinary = data[0].img
            if (err) res.status(400).json({})
            else {

                if (!fs.existsSync(`/tmp/nodetmp`)) fs.mkdirSync(`/tmp/nodetmp`);
                if (!fs.existsSync(`/tmp/nodetmp/${name}`)) fs.writeFileSync(`/tmp/nodetmp/${name}`, imgBinary, 'binary')
                res.contentType('image/jpg')
                res.status(200).sendFile(`/tmp/nodetmp/${name}`)
            }
        });
    },
    getProductList: (req, res) => {
        let id = req.params.prod_id
        let color = []
        let categoria = []
        let tag = []
        let talla = []
        let params = []

        try {

            color = JSON.parse(req.body.col).map((id) => ObjectId(id))
            categoria = JSON.parse(req.body.cat).map((id) => ObjectId(id))
            tag = JSON.parse(req.body.tag).map((id) => ObjectId(id))
            talla = JSON.parse(req.body.tal).map((id) => ObjectId(id))
        }
        catch (err) {
            color = []
            categoria = []
            tag = []
            talla = []
        }


        if (color.length) params.push({ $match: { color: { $in: color } } })
        if (categoria.length) params.push({ $match: { categoria: { $in: categoria } } })
        if (talla.length) params.push({ $match: { talla: { $in: talla } } })
        if (tag.length) params.push({ $match: { tag: { $in: tag } } })

        params.push(
            {
                $match: {
                    $or: [
                        {
                            titulo: {
                                $regex: `^${id != 'null' ? id : ''}`,
                                $options: 'i'
                            }
                        },
                        {
                            refVendedora: {
                                $regex: `^${id != 'null' ? id : ''}`,
                                $options: 'i'
                            }
                        },
                        {
                            refInterna: {
                                $regex: `^${id != 'null' ? id : ''}`,
                                $options: 'i'
                            }
                        }

                    ]
                }
            })
        params.push({ $lookup: { from: 'color', localField: 'color', foreignField: '_id', as: 'colorData' } })
        params.push({ $lookup: { from: 'tag', localField: 'tag', foreignField: '_id', as: 'tagData' } })
        params.push({ $lookup: { from: 'categoria', localField: 'categoria', foreignField: '_id', as: 'categoriaData' } })
        params.push({ $lookup: { from: 'talla', localField: 'talla', foreignField: '_id', as: 'tallaData' } })
        params.push({ $project: { img: 0, color: 0, talla: 0, tag: 0, categoria: 0 } })

        models.Producto.aggregate(params).sort({ fecha: -1 }).exec((err, data) => {
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

    addCarrito: (req, res) => {

        let token = req.headers['access-token']

        let Item = new models.CarritoItem()
        Item.id = ObjectId(req.body.producto)
        Item.valor = req.body.precio
        Item.color = ObjectId(req.body.color)
        Item.talla = ObjectId(req.body.talla)
        Item.cantidad = req.body.cantidad


        models.Carrito.find({ formato: token, active: true }, (err, data) => {
            if (err) res.status(400).json({})

            if (!data.length) {

                let Carrito = new models.Carrito()
                Carrito.formato = token
                Carrito.active = true
                Carrito.producto = [Item]

                Carrito.save((err, data) => {
                    if (err) res.status(400).json({
                        err: err,
                        data: data || null
                    })
                    else res.status(200).json({
                        err: err,
                        data: data
                    })
                })
            }
            else {
                models.Carrito.update({ formato: token, active: true }, { $push: { producto: Item } }, (err, data) => {
                    if (err) res.status(400).json({
                        err: err,
                        data: data || null
                    })
                    else res.status(200).json({})
                })
            }
        })


    },
    getCsc: (req, res) => {

        models.Config.find({ titulo: 'formato' }, { csc: 1 }, (errx, datax) => {

            let numeroCsc = parseInt(datax[0].csc) + 1
            let consec = numeroCsc.toString().padStart(5, '0')
            console.log(consec)

            if (errx) res.status(400).json({
                err: errx,
                data: data || null
            })
            else {
                models.Config.updateOne({ titulo: 'formato' }, { csc: consec }, (err, data) => {
                    if (err) res.status(400).json({
                        err: err,
                        data: data || null
                    })
                    else res.status(200).json({
                        err: err,
                        data: datax
                    })
                })
            }
        });

    },
    getListCarrito: (req, res) => {

        let token = req.headers['access-token']
        models.Carrito.aggregate(
            [
                { $match: { active: true, formato: token } },
                { $lookup: { from: 'producto', localField: 'producto.id', foreignField: '_id', as: 'Productos' } },
                { $lookup: { from: 'color', localField: 'producto.color', foreignField: '_id', as: 'Colores' } },
                { $lookup: { from: 'talla', localField: 'producto.talla', foreignField: '_id', as: 'Tallas' } },
                {
                    $project: {
                        'Productos.img': 0,
                        'Productos.talla': 0,
                        'Productos.categoria': 0,
                        'Productos.tag': 0,
                        'Productos.color': 0,
                        'Productos.fecha': 0,
                        'Productos.fileName': 0,
                        'Productos.refVendedora': 0,
                        'Productos.refInterna': 0,
                        'Productos.stock': 0,
                        'Productos.pesoImg': 0,
                        'Productos.valor': 0,
                        'Productos.descripcion': 0,
                        'Productos.__v': 0,
                        active: 0
                    }
                }
            ]
        ).exec((err, data) => {
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
    saveFormato: (req, res) => {

        let token = req.headers['access-token']
        models.Carrito.find({ active: true , formato: token }, { producto: 1 }, (err, data) => {
            let pago= 0;

            data[0]['producto'].forEach(prod => {
                pago+=parseInt(prod['cantidiad'])*parseInt(prod['valor'])
            });
            let Formato = new models.Formato()
            Formato.formato = req.body.formato
            Formato.documento = req.body.documento
            Formato.barrio = req.body.barrio
            Formato.ciudad = req.body.ciudad
            Formato.vendedor = req.body.vendedor
            Formato.total = req.body.total
            Formato.direccion = req.body.direccion
            Formato.telefono = req.body.telefono
            Formato.pago = pago
            Formato.Prodcutos = data[0]['producto']

            console.log(req.body)
            console.log(Formato)
            res.status(200).json({})
            /*
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else res.status(200).json({
                err: err,
                data: data
            })
            */

        })

    }
}