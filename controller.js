let models = require('./models')
let con = require('./config')
let qrCode = require('qrcode')
let jwt = require('jsonwebtoken')
let fs = require('fs')
let spawn = require("child_process").spawn;
const { ObjectId } = require('bson')
const { Producto } = require('./models')
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

        models.Usuario.find({ usuario: usu, password: pass }, { token: 0, password: 0 }).exec((err, data) => {

            if (err) res.status(400).json({
                err: err
            })
            else {
                if (data.length) jwt.sign({ expiresIn: "30d" }, con.conf.key, (err, tk) => {
                    if (err) res.status(400).json({
                        err: err
                    })
                    else
                        models.Usuario.updateOne(
                            { usuario: usu, password: pass },
                            { token: tk },
                            (err, datax) => {
                                if (err) res.status(400).json({
                                    err: err
                                })
                                else res.status(200).json({
                                    data: {
                                        token: tk,
                                        usuario: data
                                    }
                                })
                            })
                })
                else res.status(401).json({
                    err: { msg: 'Clave o usario incorrectos' },
                })
            }

        })
    },
    newProd: (req, res) => {
        let Producto = new models.Producto()
        Producto.titulo = req.body.titulo
        Producto.valor = req.body.valor
        Producto.costo = req.body.cost
        Producto.descripcion = req.body.descripcion
        Producto.refVendedora = req.body.refVendedora
        Producto.refInterna = req.body.refInterna

        Producto.fileName = JSON.parse(req.body.combinaciones)[0].img.split('.')[0]
        let combinaciones = []
        JSON.parse(req.body.combinaciones).forEach((com) => {
            let auxCombi = new models.Combinacion()
            auxCombi.talla = ObjectId(com.talla)
            auxCombi.color = ObjectId(com.color)
            auxCombi.img = com.img
            let stockAux = typeof com.stock == 'string' ? parseInt(com.stock) : com.stock
            auxCombi.stock = stockAux
            combinaciones.push(auxCombi)
        })
        Producto.combinacion = combinaciones

        req.files.forEach((img) => {
            fs.writeFileSync(`/home/ubuntu/fullImg/${img.originalname}`, img.buffer, 'binary')
            let process = spawn('python3', ["/home/ubuntu/rezise.py", `/home/ubuntu/fullImg/${img.originalname}`, img.originalname])

            process.on('close', (data) => {
                if (data) res.status(400).json({
                    err: 'Error al procesar archivo',
                })
                else Producto.save((err, data) => {
                    if (err) res.status(401).json({
                        err: err,
                    })
                    else res.status(200).json({
                        err: err,
                        data: data
                    })
                })
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
        let act = req.params.actv == 'active' ? true : false
        models.Color.find(act ? { active: true } : {}, (err, data) => {
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
        let act = req.params.actv == 'active' ? true : false
        models.Talla.find(act ? { active: true } : {}, (err, data) => {
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
        let act = req.params.actv == 'active' ? true : false
        models.Categoria.find(act ? { active: true } : {}, (err, data) => {
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
        let act = req.params.actv == 'active' ? true : false
        models.Tag.find(act ? { active: true } : {}, (err, data) => {
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
    getPreView: (req, res) => {
        let id = req.params.prod_id
        res.contentType('image/jpg')
        res.status(200).sendFile(`/home/ubuntu/preview/${id}.jpg`)

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


        let id = req.body.prod_id
        let busqueda = req.body.busqueda
        let init = req.body.init
        let last = req.body.last
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


        if (color.length) params.push({ $match: { 'combinacion.color': { $in: color } } })
        if (categoria.length) params.push({ $match: { categoria: { $in: categoria } } })
        if (talla.length) params.push({ $match: { 'combinacion.talla': { $in: talla } } })
        if (tag.length) params.push({ $match: { tag: { $in: tag } } })

        params.push(
            {
                $match: {
                    $or: [
                        {
                            titulo: {
                                $regex: `^${busqueda != 'null' ? busqueda : ''}`,
                                $options: 'i'
                            }
                        },
                        {
                            refVendedora: {
                                $regex: `^${busqueda != 'null' ? busqueda : ''}`,
                                $options: 'i'
                            }
                        },
                        {
                            refInterna: {
                                $regex: `^${busqueda != 'null' ? busqueda : ''}`,
                                $options: 'i'
                            }
                        }

                    ]
                }
            })
        if (id && id != 'null') params.push({ $match: { _id: ObjectId(id) } })
        params.push({ $lookup: { from: 'color', localField: 'combinacion.color', foreignField: '_id', as: 'colorData' } })
        params.push({ $lookup: { from: 'tag', localField: 'tag', foreignField: '_id', as: 'tagData' } })
        params.push({ $lookup: { from: 'categoria', localField: 'categoria', foreignField: '_id', as: 'categoriaData' } })
        params.push({ $lookup: { from: 'talla', localField: 'combinacion.talla', foreignField: '_id', as: 'tallaData' } })
        params.push({ $project: { img: 0, color: 0, talla: 0, tag: 0, categoria: 0 } })
        params.push({ $sort: { titulo: 1 } })
        models.Producto.aggregate(params).exec((err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else {
                let info = [];
                try {
                    info = data.slice(parseInt(init), parseInt(last))
                } catch (e) {
                    info = []
                }
                res.status(200).json({
                    err: err,
                    data: info
                })
            }
        })
    },
    updProducto: (req, res) => {

        let titulo = req.body.titulo
        let id = req.body.prod_id
        let valor = req.body.valor
        let costo = req.body.costo
        let descripcion = req.body.descripcion
        let refVendedora = req.body.refVendedora
        let refInterna = req.body.refInterna

        models.Producto.updateOne(
            {
                _id: id
            },
            {
                $set: {
                    valor: valor,
                    costo: costo,
                    descripcion: descripcion,
                    refInterna: refInterna,
                    refVendedora: refVendedora,
                    titulo: titulo
                }
            },
            (err, data) => {
                if (err) res.status(400).json({
                    err: err,
                    data: data || null
                })
                else res.status(200).json({
                    err: err,
                    data: data
                })
            }
        )
    },
    addCarrito: (req, res) => {

        let token = req.body.id_user
        let Item = new models.CarritoItem()
        Item.id = ObjectId(req.body.producto)
        Item.valor = req.body.precio
        Item.color = ObjectId(req.body.color)
        Item.talla = ObjectId(req.body.talla)
        Item.cantidad = req.body.cantidad
        Item.restante = req.body.cantidad
        Item.combinacion = req.body.idCombi


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
                    else models.Producto.updateOne({ _id: ObjectId(req.body.producto), 'combinacion._id': ObjectId(req.body.idCombi) }, { $inc: { 'combinacion.$.stock': (-req.body.cantidad) } }, (err, datax) => {
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
                models.Carrito.updateOne({ formato: token, active: true }, { $push: { producto: Item } }, (err, data) => {

                    if (err) res.status(400).json({
                        err: err,
                        data: data || null
                    })
                    else models.Producto.updateOne({ _id: ObjectId(req.body.producto), 'combinacion._id': ObjectId(req.body.idCombi) }, { $inc: { 'combinacion.$.stock': (-req.body.cantidad) } }, (err, datax) => {
                        if (err) res.status(400).json({
                            err: err,
                            data: datax || null
                        })
                        else res.status(200).json({
                            err: err,
                            data: datax
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
        models.Carrito.aggregate(
            [
                { $match: { active: true, formato: req.params.cc } },
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

        let arrayData = []
        if (req.params.idFormat == 'false') {
            arrayData.push({ $match: { vendedor: ObjectId(req.body.vendedor) } });
        } else if (req.params.idFormat != 'false' && req.body.venfil != 'all') {
            arrayData.push({ $match: { vendedor: ObjectId(req.body.venfil) } });
        }


        let dateIni = req.body.fecini.split(' ')[0];
        let dateFin = req.body.fecfin.split(' ')[0];
        dateIni = new Date(`${dateIni}T00:00:00Z`)
        dateFin = new Date(`${dateFin}T23:59:59Z`)

        arrayData.push({
            $match: {
                fecha: {
                    $gte: dateIni,
                    $lte: dateFin
                }
            }
        })


        arrayData.push(
            { $lookup: { from: 'etapa', localField: 'etapa', foreignField: '_id', as: 'Etapa' } },
            { $lookup: { from: 'pago', localField: 'pago', foreignField: 'short', as: 'FPago' } },
            { $lookup: { from: 'producto', localField: 'Productos.id', foreignField: '_id', as: 'Prods' } },
            { $lookup: { from: 'color', localField: 'Productos.color', foreignField: '_id', as: 'Colores' } },
            { $lookup: { from: 'talla', localField: 'Productos.talla', foreignField: '_id', as: 'Tallas' } },
            { $lookup: { from: 'usuario', localField: 'vendedor', foreignField: '_id', as: 'Vendedor' } },
            {
                $project: {
                    active: 0,
                    'FPago._id:': 0,
                    'Prods.talla': 0,
                    'Prods.categoria': 0,
                    'Prods.combinacion': 0,
                    'Prods.tag': 0,
                    'Prods.color': 0,
                    'Prods.fecha': 0,
                    'Prods.refVendedora': 0,
                    'Prods.refInterna': 0,
                    'Prods.stock': 0,
                    'Prods.pesoImg': 0,
                    'Prods.valor': 0,
                    'Prods.descripcion': 0,
                    'Prods.__v': 0,
                }
            }
        )

        models.Formato.aggregate(arrayData).exec((err, data) => {
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
    formatoId: (req, res) => {

        models.Formato.aggregate(
            [
                { $match: { formato: req.params.idFormat } },
                { $lookup: { from: 'etapa', localField: 'etapa', foreignField: '_id', as: 'Etapa' } },
                { $lookup: { from: 'pago', localField: 'pago', foreignField: 'short', as: 'FPago' } },
                { $lookup: { from: 'producto', localField: 'Productos.id', foreignField: '_id', as: 'Prods' } },
                { $lookup: { from: 'color', localField: 'Productos.color', foreignField: '_id', as: 'Colores' } },
                { $lookup: { from: 'talla', localField: 'Productos.talla', foreignField: '_id', as: 'Tallas' } },
                { $lookup: { from: 'usuario', localField: 'vendedor', foreignField: '_id', as: 'Vendedor' } },
                {
                    $project: {
                        active: 0,
                        'FPago._id:': 0,
                        'Prods.talla': 0,
                        'Prods.categoria': 0,
                        'Prods.tag': 0,
                        'Prods.color': 0,
                        'Prods.fecha': 0,
                        'Prods.refVendedora': 0,
                        'Prods.refInterna': 0,
                        'Prods.stock': 0,
                        'Prods.pesoImg': 0,
                        'Prods.valor': 0,
                        'Prods.descripcion': 0,
                        'Prods.__v': 0,
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

        models.Config.find({ titulo: 'formato' }, { csc: 1 }, (errCsc, dataCsc) => {
            if (errCsc) res.status(400).json({
                err: errCsc,
                data: data || null
            })
            else {


                let numeroCsc = parseInt(dataCsc[0].csc) + 1
                let consec = numeroCsc.toString().padStart(5, '0')

                models.Config.updateOne({ titulo: 'formato' }, { csc: consec }, (err, data) => {
                    if (err) res.status(400).json({
                        err: err,
                        data: data || null
                    })
                    else {

                        let token = req.body.cc
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
                                let flag = true
                                let Formato = new models.Formato()
                                try {
                                    Formato.formato = 'FT' + consec
                                    Formato.documento = parseInt(req.body.documento)
                                    Formato.barrio = req.body.barrio
                                    Formato.ciudad = req.body.ciudad
                                    Formato.vendedor = ObjectId(req.body.vendedor)
                                    Formato.total = pago
                                    Formato.direccion = req.body.direccion
                                    Formato.nombre = req.body.nombre
                                    Formato.telefono = parseInt(req.body.telefono)
                                    Formato.pago = req.body.pago
                                    Formato.Productos = data[0]['producto']
                                    Formato.envio = parseInt(req.body.envio)
                                    Formato.observacion = req.body.obs
                                }
                                catch (error) {
                                    flag = false
                                    res.status(400).json({
                                        err: error,
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
                                                data: { msg: 'FT' + consec }
                                            })
                                        })
                                    })
                            }
                        })

                    }
                })



            }

        });


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
                err: err
            })
            else res.status(200).json({
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

        models.Formato.find({ 'Productos.id': { $in: [ObjectId(req.body.prod_id)] } }, { fac: 0 }).exec((err, data) => {
            if (data.length > 0 || err) res.status(400).json({})
            else models.Carrito.find({ 'producto.id': { $in: [ObjectId(req.body.prod_id)] } }).exec((err, data) => {

                if (data.length > 0 || err) res.status(400).json({})
                else models.Producto.remove(
                    { _id: ObjectId(req.body.prod_id) }
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
    removeCarrtito: async (req, res) => {


        let token = req.body.id_user
        //let Item = new models.CarritoItem()
        let prodId = ObjectId(req.body.prodId)
        let carrId = ObjectId(req.body.carritoId)
        let itemId = ObjectId(req.body.itemId)
        let combId = ObjectId(req.body.combId)
        let cantid = parseInt(req.body.cantidad)
        let flag = false

        //Eliminar Producto del carrito
        try {
            let auxCarrito = await models.Carrito.updateOne(
                { _id: carrId, formato: token, active: true },
                {
                    $pull:
                        { producto: { id: prodId, _id: itemId } }
                }

            ).exec()
            if (auxCarrito.nModified > 0) flag = true
        } catch (error) {
            console.log('catch error')
            res.status(400).json({
                err: "Error al eliminar el producto.",
                data: null
            })
        }
        // Regresar saldo al inventario
        if (flag) try {
            models.Producto.updateOne(
                { _id: prodId, 'combinacion._id': combId },
                { $inc: { 'combinacion.$.stock': (cantid) } },
                (err, datax) => {
                    if (err) res.status(400).json({
                        err: 'Error al actualizar el invetario, actualice manualmente.',
                        data: datax || null
                    })
                    else res.status(200).json({
                        err: err,
                        data: datax
                    })
                })
        } catch (error) {

        }


        /*  models.Carrito.find({ formato: token, active: true }, (err, data) => {
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
                     else models.Producto.updateOne({ _id: ObjectId(req.body.producto), 'combinacion._id': ObjectId(req.body.idCombi) }, { $inc: { 'combinacion.$.stock': (-req.body.cantidad) } }, (err, datax) => {
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
                 
             }
         })
 
*/




    },
    procesarPed: (req, res) => {

        models.Formato.updateOne(

            {
                _id: ObjectId(req.body.idFor),
                formato: req.body.formato,
                Productos: {
                    $elemMatch: {
                        id: ObjectId(req.body.id),
                        talla: ObjectId(req.body.talla),
                        color: ObjectId(req.body.color),
                        restante: { $gte: 1 }
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
    },
    generateQr: (req, res) => {
        try {
            let data = JSON.parse(req.body.data)
            let name = req.headers['access-token']

            if (fs.existsSync(`/tmp/nodetmp/qr/${name}.jpg`)) fs.unlinkSync(`/tmp/nodetmp/qr/${name}.jpg`)
            qrCode.toFile(`/tmp/nodetmp/qr/${name}.jpg`, data, function (err) {
                if (err) res.status(400).json({})
                res.contentType('image/jpg')
                res.status(200).sendFile(`/tmp/nodetmp/qr/${name}.jpg`)
            })
        } catch (onError) {
            res.status(400).json({
                err: onError
            })
        }

    },
    sendEmail: (req, res) => {
        let fecIni = new Date(`${req.body.fecini}T00:00:00Z`)
        let fecFin = new Date(`${req.body.fecfin}T23:59:59Z`)
        let email = req.body.email

        let message = {
            from: 'admin@amordebb.com',
            to: email,
            subject: `Formato de Ventas entre ${req.body.fecini} y ${req.body.fecfin}`,
            text: 'Formatos de Venta Amor de Bebe'
        }

        models.Formato.aggregate(
            [
                {
                    $match: {
                        fecha: {
                            $gte: fecIni,
                            $lt: fecFin
                        }
                    }
                },
                { $lookup: { from: 'producto', localField: 'Productos.id', foreignField: '_id', as: 'ProdInfo' } },
                { $lookup: { from: 'color', localField: 'Productos.color', foreignField: '_id', as: 'ColorInfo' } },
                { $lookup: { from: 'usuario', localField: 'vendedor', foreignField: '_id', as: 'VendedorInfo' } },
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
                        'ColorInfo.primario': 0,
                        'ColorInfo.segundario': 0,
                        'ColorInfo.active': 0,
                        'ColorInfo.__v': 0,
                        __v: 0
                    }
                }
            ]
        ).exec((err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else if (data.length) {
                var allLines = []
                var arryLine = []
                let documento = con.conf.csvEncabezado

                data.forEach((ft) => {
                    ft.Productos.forEach((prod) => {

                        stringDate = new Date(ft.fecha - 3600000 * 5).toISOString()
                        arryLine.push(stringDate)
                        var costUni = 0
                        ft.ProdInfo.forEach((info) => {

                            if (info._id.equals(prod.id)) {
                                costUni = info.costo
                                arryLine.push(info.refVendedora)
                            }
                        })

                        ft.ColorInfo.forEach((info) => {
                            if (info._id.equals(prod.color)) arryLine.push(info.titulo)
                        })
                        arryLine.push(prod.cantidad)
                        arryLine.push(prod.valor)
                        arryLine.push(costUni)
                        arryLine.push(prod.valor * prod.cantidad)
                        arryLine.push(costUni * prod.cantidad)
                        arryLine.push(ft.formato.substr(0, 2))
                        arryLine.push(ft.formato.substr(2))
                        let vendedora = `${ft.VendedorInfo[0].nombre} ${ft.VendedorInfo[0].apellido}`
                        arryLine.push(vendedora)
                        /* ft.ColorInfo.forEach((info) => {
                            if (info._id.equals(prod.color)) arryLine.push(info.titulo)
                        }) */
                        let auxLine = arryLine.join(con.conf.separador) + '\n'
                        documento += auxLine
                        arryLine = []
                    })
                })

                message.attachments = [
                    {
                        filename: 'Formato_de_Venta.csv',
                        content: documento
                    }
                ]

                con.conf.transport.sendMail(message, function (err, info) {
                    if (err) res.status(400).json({})
                    else res.status(200).json({})
                });

            }
            else {
                res.status(400).json({
                    err: err,
                    data: data || null
                })
            }
        })
    },
    updateStock: (req, res) => {
        let auxStock = typeof req.body.stock == "string" ? parseInt(req.body.stock) : req.body.stock
        Producto.updateOne({ _id: ObjectId(req.body.id), 'combinacion._id': ObjectId(req.body.combi) }, { $set: { 'combinacion.$.stock': auxStock } }).exec((err, data) => {
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
    changeImage: (req, res) => {
        let lastImg = req.body.lastImg;
        let idProd = req.body.id;
        let combi = req.body.combi;

        let img = req.files[0]
        fs.unlinkSync(`/home/ubuntu/fullImg/${lastImg}.jpg`);
        fs.writeFileSync(`/home/ubuntu/fullImg/${img.originalname}`, img.buffer, 'binary')
        let process = spawn('python3', ["/home/ubuntu/rezise.py", `/home/ubuntu/fullImg/${img.originalname}`, img.originalname])


        Producto.updateOne({ _id: ObjectId(idProd), 'combinacion._id': ObjectId(combi) }, {
            $set: {
                fileName: img.originalname.split('.')[0],
                'combinacion.$.img': img.originalname.split('.')[0],
            }
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
    },
    addNewCombi: (req, res) => {

        let img = req.files[0]
        fs.writeFileSync(`/home/ubuntu/fullImg/${img.originalname}`, img.buffer, 'binary')
        let process = spawn('python3', ["/home/ubuntu/rezise.py", `/home/ubuntu/fullImg/${img.originalname}`, img.originalname])


        let auxCombi = new models.Combinacion()
        auxCombi.talla = ObjectId(req.body.talla)
        auxCombi.color = ObjectId(req.body.color)
        auxCombi.img = img.originalname.split('.')[0]
        let stockAux = typeof req.body.stock == 'string' ? parseInt(req.body.stock) : req.body.stock
        auxCombi.stock = stockAux

        Producto.updateOne({ _id: ObjectId(req.body.idProd) }, {
            $push: {
                combinacion: auxCombi
            }
        }).exec((err, data) => {
            if (err) res.status(400).json({
                err: err,
                data: data || null
            })
            else Producto.updateOne({ _id: ObjectId(req.body.idProd) }, {
                $set: {
                    fileName: img.originalname.split('.')[0]
                }
            }).exec((errx, datax) => {
                if (err) res.status(400).json({
                    err: errx,
                    data: datax || null
                })
                else res.status(200).json({
                    err: errx,
                    data: datax

                })

            })
        })
    },
    saveFactura: (req, res) => {

        let img = req.files[0]
        let nameImg = img.originalname.split('.')[0];
        fs.writeFileSync(`/home/ubuntu/facs/${img.originalname}`, img.buffer, 'binary')

        models.Formato.updateOne({ _id: ObjectId(req.body.id), formato: req.body.formato }, {
            $set: {
                fac: nameImg
            }
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
    },
    getFac: (req, res) => {
        let id = req.params.name
        res.contentType('image/jpg')
        res.status(200).sendFile(`/home/ubuntu/facs/${id}.jpg`)

    },
    updFormat: (req, res) => {

    },
    removeCombi: (req, res) => {
        models.Producto.updateOne(
            { _id: ObjectId(req.body.idProd) },
            {
                $pull: {
                    combinacion: { _id: ObjectId(req.body.idCombi) }
                }
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
}