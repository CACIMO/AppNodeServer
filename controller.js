let models = require('./models')
let con = require('./config')
let qrCode = require('qrcode')
let jwt = require('jsonwebtoken')
let fs = require('fs')
const { ObjectId } = require('bson')
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

            if (err) module.exports.errorLog(req, err).finally(() => { res.status(400).json({}) })
            else res.status(200).json({
                data: decoded
            })
        })
        else res.status(400).json({})
    },
    errorLog: (req, err) => {
        let deviceId = req.headers['device-id']

        let Error = new models.ErrorLog()

        Error.error = err
        Error.deviceId = deviceId

        let promise = new Promise((err, solve) => {
            Error.save((errx, resp) => {
                if (errx) { err(errx) }
                else { solve(resp) }
            })
        })

        return promise

    },
    logIn: (req, res) => {

        let usu = req.body.usuario
        let pass = req.body.password

        models.Usuario.aggregate(
            [
                { $match: { usuario: usu, password: pass } },
                { $lookup: { from: 'permiso', localField: 'Permiso', foreignField: '_id', as: 'Permisos' } },
                { $lookup: { from: 'menu', localField: 'Permisos.menuOptions', foreignField: '_id', as: 'MenuData' } },
                { $match: { 'MenuData.active': true } },
                {
                    $project: {
                        Permisos: 0,
                    }
                }

            ]
        ).exec((err, data) => {
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
                    else
                        models.Usuario.updateOne(
                            { usuario: usu, password: pass },
                            { token: tk },
                            (err, datax) => {
                                if (err) res.status(400).json({
                                    err: err,
                                    data: datax || null
                                })
                                else res.status(200).json({
                                    err: err,
                                    data: {
                                        token: tk,
                                        usuario: data
                                    }
                                })
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
        if (req.file) Producto.img = req.file.buffer

        var params = {
            titulo: req.body.titulo,
            valor: req.body.valor,
            fileName: req.body.nombre,
            descripcion: req.body.descripcion,
            refVendedora: req.body.refVendedora,
            refInterna: req.body.refInterna,
            stock: req.body.stock,
            color: JSON.parse(req.body.color).map((id) => ObjectId(id)),
            categoria: JSON.parse(req.body.categoria).map((id) => ObjectId(id)),
            tag: JSON.parse(req.body.tag).map((id) => ObjectId(id)),
            talla: JSON.parse(req.body.talla).map((id) => ObjectId(id))
        }
        if (req.file) {
            params.pesoImg = req.body.pesoImg
            params.img = req.file.buffer
        }


        if (req.body.id) models.Producto.updateOne({ _id: ObjectId(req.body.id) }, params).exec((err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else res.status(200).json({
                err: err,
                data: 'Producto Creado Correctamente.'
            })

        });
        else Producto.save((err, data) => {
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
        models.Color.find({ active: true }, (err, data) => {
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
        models.Talla.find({ active: true }, (err, data) => {
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
        models.Categoria.find({ active: true }, (err, data) => {
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
        models.Tag.find({ active: true }, (err, data) => {
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
    getFac: (req, res) => {
        let id = req.params.formato
        models.Formato.find({ _id: ObjectId(id) }, { fac: 1 }, (err, data) => {

            let name = id
            let imgBinary = data[0].fac
            if (err) res.status(400).json({})
            else {

                if (!fs.existsSync(`/tmp/nodetmp`)) fs.mkdirSync(`/tmp/nodetmp`);
                /* if (!fs.existsSync(`/tmp/nodetmp/${name}`))  */fs.writeFileSync(`/tmp/nodetmp/${name}`, imgBinary, 'binary')
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
        Item.restante = req.body.cantidad


        models.Carrito.find({ formato: token, active: true }, (err, data) => {
            if (err) res.status(400).json({})

            if (!data.length) {

                let Carrito = new models.Carrito()
                Carrito.formato = token
                Carrito.active = true
                Carrito.producto = [Item]
                Carrito.envio = req.body.envio

                Carrito.save((err, data) => {

                    if (err) res.status(400).json({
                        err: err,
                        data: data || null
                    })
                    else models.Producto.updateOne({ _id: ObjectId(req.body.producto) }, { $inc: { stock: (-req.body.cantidad) } }, (err, datax) => {
                        if (err) res.status(400).json({
                            err: err,
                            data: datax || null
                        })
                        else res.status(200).json({
                            err: err,
                            data: data
                        })
                    })
                })
            }
            else {
                models.Carrito.update({ formato: token, active: true }, { $push: { producto: Item } }, (err, data) => {

                    if (err) res.status(400).json({
                        err: err,
                        data: data || null
                    })
                    else models.Producto.updateOne({ _id: ObjectId(req.body.producto) }, { $inc: { stock: (-req.body.cantidad) } }, (err, datax) => {
                        if (err) res.status(400).json({
                            err: err,
                            data: datax || null
                        })
                        else res.status(200).json({
                            err: err,
                            data: data
                        })
                    })
                })
            }
        })


    },
    getCsc: (req, res) => {

        models.Config.find({ titulo: 'formato' }, { csc: 1 }, (errx, datax) => {

            let numeroCsc = parseInt(datax[0].csc) + 1
            let consec = numeroCsc.toString().padStart(5, '0')

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
    getFormatoDet: (req, res) => {

        models.Formato.aggregate(
            [
                { $match: { _id: ObjectId(req.body.formato) } },
                { $lookup: { from: 'producto', localField: 'Productos.id', foreignField: '_id', as: 'Prods' } },
                { $lookup: { from: 'color', localField: 'Productos.color', foreignField: '_id', as: 'Colores' } },
                { $lookup: { from: 'talla', localField: 'Productos.talla', foreignField: '_id', as: 'Tallas' } },
                { $lookup: { from: 'usuario', localField: 'vendedor', foreignField: '_id', as: 'Vendedor' } },
                { $lookup: { from: 'etapa', localField: 'etapa', foreignField: '_id', as: 'Etapa' } },
                {
                    $project: {
                        'Prods.img': 0,
                        'Prods.talla': 0,
                        'Prods.categoria': 0,
                        'Prods.tag': 0,
                        'Prods.color': 0,
                        'Prods.fecha': 0,
                        'Prods.fileName': 0,
                        'Prods.refVendedora': 0,
                        'Prods.refInterna': 0,
                        'Prods.stock': 0,
                        'Prods.pesoImg': 0,
                        'Prods.valor': 0,
                        'Prods.descripcion': 0,
                        'Prods.__v': 0,
                        fac: 0,
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
    getFormato: (req, res) => {

        models.Formato.aggregate(
            [
                { $match: { vendedor: ObjectId(req.body.vendedor) } },
                { $lookup: { from: 'etapa', localField: 'etapa', foreignField: '_id', as: 'Etapa' } },
                { $lookup: { from: 'pago', localField: 'pago', foreignField: 'short', as: 'FPago' } },
                {
                    $project: {
                        Productos: 0,
                        active: 0,
                        'FPago._id:': 0,
                        fac: 0
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
        models.Carrito.find({ active: true, formato: token }, { producto: 1 }, (err, data) => {

            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else {
                let pago = 0;

                data[0]['producto'].forEach(prod => {
                    pago += parseInt(prod['cantidad']) * parseInt(prod['valor'])
                });
                pago += parseInt(req.body.envio)
                flag = true
                let Formato = new models.Formato()
                try {
                    Formato.formato = req.body.formato
                    Formato.documento = req.body.documento
                    Formato.barrio = req.body.barrio
                    Formato.ciudad = req.body.ciudad
                    Formato.vendedor = ObjectId(req.body.vendedor)
                    Formato.total = pago
                    Formato.direccion = req.body.direccion
                    Formato.nombre = req.body.nombre
                    Formato.telefono = req.body.telefono
                    Formato.pago = req.body.pago
                    Formato.Productos = data[0]['producto']
                    Formato.envio = req.body.envio
                }
                catch (error) {
                    console.log(error)
                    flag = false
                    res.status(400).json({
                        err: err,
                        data: data || null
                    })
                }

                if (flag) models.Carrito.updateOne(
                    { active: true, formato: token },
                    { active: false, formato: req.body.formato },
                    (err, data) => {
                        if (err) res.status(400).json({
                            err: err,
                            data: data || null
                        })
                        else Formato.save((err, data) => {
                            if (err) res.status(400).json({
                                err: err,
                                data: data || null
                            })
                            else res.status(200).json({
                                err: err,
                                data: { msg: req.body.formato }
                            })
                        })
                    })
            }

        })

    },
    getUser: (req, res) => {
        models.Usuario.aggregate(
            [
                { $lookup: { from: 'permiso', localField: 'Permiso', foreignField: '_id', as: 'Permisos' } },
                {
                    $project: {
                        password: 0,
                        'Permisos.menuOptions': 0
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
    getUSerTk: (req, res) => {

        let tk = req.headers['access-token']

        models.Usuario.aggregate(
            [
                { $match: { token: tk } },
                { $lookup: { from: 'permiso', localField: 'Permiso', foreignField: '_id', as: 'Permisos' } },
                { $lookup: { from: 'menu', localField: 'Permisos.menuOptions', foreignField: '_id', as: 'MenuData' } },
                { $match: { 'MenuData.active': true } },
                {
                    $project: {
                        Permisos: 0,
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
    updateUser: (req, res) => {

        let jsonAux = {}
        switch (req.body.type) {
            case 'N':
                jsonAux = { $set: { nombre: req.body.data } }
                break;
            case 'U':
                jsonAux = { $set: { usuario: req.body.data } }
                break;
            case 'C':
                jsonAux = { $set: { correo: req.body.data } }
                break;
            case 'T':
                jsonAux = { $set: { telefono: req.body.data } }
                break;
            case 'P':
                jsonAux = { $set: { Permiso: ObjectId(req.body.data) } }
                break;
        }
        models.Usuario.updateOne(
            { _id: ObjectId(req.body.userId) },
            jsonAux
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
    getUserId: (req, res) => {

        let userId = req.body.userId

        models.Usuario.aggregate(
            [
                { $match: { _id: ObjectId(userId) } },
                { $lookup: { from: 'permiso', localField: 'Permiso', foreignField: '_id', as: 'Permisos' } },
                {
                    $project: {
                        password: 0,
                        'Permisos.menuOptions': 0
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
    getFormatoAll: (req, res) => {

        models.Formato.aggregate(
            [
                { $lookup: { from: 'etapa', localField: 'etapa', foreignField: '_id', as: 'Etapa' } },
                { $lookup: { from: 'pago', localField: 'pago', foreignField: 'short', as: 'FPago' } },
                {
                    $project: {
                        Productos: 0,
                        active: 0,
                        'FPago._id:': 0,
                        'Etapa._id:': 0,
                        fac: 0
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
    deleteProd: (req, res) => {

        models.Formato.find({ 'Productos.id': { $in: [ObjectId(req.params.prod_id)] } }, { fac: 0 }).exec((err, data) => {
            if (data.length > 0 || err) res.status(400).json({})
            else models.Carrito.find({ 'producto.id': { $in: [ObjectId(req.params.prod_id)] } }).exec((err, data) => {

                if (data.length > 0 || err) res.status(400).json({})
                else models.Producto.remove(
                    { _id: ObjectId(req.params.prod_id) }
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
            })
        })
    },
    cambiarEtapa: (req, res) => {
        models.Formato.updateOne(
            { _id: ObjectId(req.params.formato) },
            { etapa: ObjectId(req.body.etapaId) },
            (err, data) => {
                if (err) res.status(400).json({
                    err: err,
                    data: data || null
                })
                else res.status(200).json({})
            })
    },
    subirFactura: (req, res) => {

        if (req.file) models.Formato.updateOne(
            { _id: ObjectId(req.params.formato) },
            { fac: req.file.buffer },
            (err, data) => {
                if (err) res.status(400).json({
                    err: err,
                    data: data || null
                })
                else res.status(200).json({})
            })
        else res.status(400).json({})
    },
    removeCarrtito: (req, res) => {

        models.Producto.updateOne({ _id: ObjectId(req.body.idProducto) }, { $inc: { stock: (req.body.cantidad) } }, (err, datax) => {
            if (err) res.status(400).json({
                err: err,
                data: datax || null
            })
            else models.Carrito.update({ _id: ObjectId(req.body.idCarrito) }, { $pull: { producto: { _id: ObjectId(req.body.iditem) } } }).exec((err, data) => {
                if (err) res.status(400).json({
                    err: err,
                    data: data || null
                })
                else res.status(200).json({
                    err: err,
                    data: data
                })
            })
        })
    },
    procesarPed: (req, res) => {
        console.log(req.body)
        models.Formato.findOne({
            _id: ObjectId(req.body.formatoId)
        }, {
            _id: 0,
            Productos: {
                $elemMatch: {
                    id: ObjectId(req.body.itemId),
                    color: ObjectId(req.body.colorId),
                    talla: ObjectId(req.body.tallaId)
                }
            }
        }).exec((err, data) => {



            let thereAreProds = data.Productos.length
            if (err) res.status(400).json({
                err: {
                    msg: 'Error en el server'
                }
            })
            else if (thereAreProds) {
                let rest = data.Productos[0].restante
                if (rest) {

                    models.Formato.updateOne(
                        {
                            _id: ObjectId(req.body.formatoId),
                            Productos: {
                                $elemMatch: {
                                    id: ObjectId(req.body.itemId),
                                    color: ObjectId(req.body.colorId),
                                    talla: ObjectId(req.body.tallaId)
                                }
                            }
                        },
                        {
                            $inc: { "Productos.$.restante": -1 },
                            $set: { etapa: ObjectId("604b88049ed8c060cc0e11dc") }
                        }).exec((err, data) => {
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
                else res.status(400).json({
                    err: {
                        msg: 'Ya ha registrado todas las unidades'
                    }
                })
            }
            else {
                res.status(400).json({
                    err: { msg: 'El producto no hace parte de la orden.' }
                })
            }

        })
    },
    generateQr: (req, res) => {
        try {
            console.log(req.params.id)
            let data = JSON.parse(req.params.id)
            let name = req.headers['access-token']

            if (fs.existsSync(`/tmp/nodetmp/${name}.png`)) fs.unlinkSync(`/tmp/nodetmp/${name}.png`)
            qrCode.toFile(`/tmp/nodetmp/${name}.png`, req.params.id, function (err) {
                if (err) res.status(400).json({})
                res.contentType('image/png')
                res.status(200).sendFile(`/tmp/nodetmp/${name}.png`)
            })
        } catch (onError) {
            console.log(onError)
            res.status(400).json({
                err: onError
            })
        }

    },
    sendEmail: (req, res) => {

        let fecIni = new Date(req.body.fecini)
        let fecFin = new Date(req.body.fecfin)
        let email = req.body.email
        let message = {
            from: 'admin@amordebb.com',
            to: email,
            subject: `Formato de Ventas entre ${fecIni} y ${fecFin}`,
            text: 'Formatos de Venta Amor de Bebe'
        }

        models.Formato.aggregate(
            [
                { $lookup: { from: 'producto', localField: 'Productos.id', foreignField: '_id', as: 'ProdInfo' } },
                { $lookup: { from: 'color', localField: 'Productos.color', foreignField: '_id', as: 'ColorInfo' } },
                {
                    $project: {
                        fac: 0,
                        'ProdInfo.img': 0,
                        'ProdInfo.tag': 0,
                        'ProdInfo.color': 0,
                        'ProdInfo.categoria': 0,
                        'ProdInfo.talla': 0,
                        'ProdInfo.valor': 0,
                        'ProdInfo.fileName': 0,
                        'ProdInfo.descripcion': 0,
                        'ProdInfo.refInterna': 0,
                        'ProdInfo.stock': 0,
                        'ProdInfo.pesoImg': 0,
                        'ProdInfo.__v': 0,
                        'ProdInfo.fecha': 0,
                        __v: 0
                    }
                }
            ]
        ).exec((err, data) => {

            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else {
                let arryLine = []
                data.forEach((ft) => {
                    

                    ft.Productos.forEach(( prod)=>{
                        arryLine.add(ft.fecha)
                        let Ref = ft.ProdInfo.filter((info)=>info._id == prod.id)//[0].refInterna
                        console.log(Ref)

                    })

                    arryLine.add(ft.formato.substr(0,2))
                    arryLine.add(ft.formato.substr(2))
                    

                })
            }
            res.status(200).json({})



            /* 
                    const message = {
                        from: 'admin@amordebb.com', // Sender address
                        to: 'cart684@gmail.com',         // List of recipients
                        subject: 'Design Your Model S | Tesla', // Subject line
                        text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
                    };
                    con.conf.transport.sendMail(message, function (err, info) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(info);
                        }
                    });
             */
        })
    }
}