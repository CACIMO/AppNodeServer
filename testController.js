let models = require('./models')
let con = require('./config')
let qrCode = require('qrcode')
let jwt = require('jsonwebtoken')
let fs = require('fs')
let spawn = require("child_process").spawn;
const { ObjectId } = require('bson')

function debugReq(req) {
    if (con.conf.debugMode) {
        console.log("########## -- ENCABEZADOS -- ##########")
        console.log(req.headers)
        console.log("########## -- QUERY PARAMS -- ##########")
        console.log(req.params)
        console.log("########## -- BODY  REQUEST -- ##########")
        console.log(req.body)
    }
}
function errorDTO(req, error) {

    console.log("########## -- ENCABEZADOS -- ##########")
    console.log(req.headers)
    console.log("########## -- QUERY PARAMS -- ##########")
    console.log(req.params)
    console.log("########## -- BODY  REQUEST -- ##########")
    console.log(req.body)
    console.log("########## -- THE ERROR -- ##########")
    console.log(error)

    return {
        successful: false,
        error: error
    }
}
function successfulDTO(data) {
    return {
        successful: true,
        data: data
    }
}
async function transaction(req, res, execute) {
    const session = await models.conn.startSession();
    try {
        const session = await models.conn.startSession();
        await session.withTransaction(async () => {
            /* 
                This is the final part of the transaction. 
                Get the response from the process and send it to the device. 
            */
            let data = await execute(session)
            let responseDTO = successfulDTO(data)
            res.status(200).json(responseDTO)
        })

    } catch (e) {
        let responseDTO = errorDTO(req, e)
        res.status(400).json(responseDTO)
        console.log("Transaccion Finalizada con errores.", e)
    }
    session.endSession();
}
module.exports = {
    logIn: async (req, res) => {
        debugReq(req)

        let usu = req.body.usuario
        let pass = req.body.password
        await transaction(req, res, async (session) => {
            //it's searched, if the user are in the db
            let user = await models.Usuario.find({ usuario: usu })

            let token
            //it's searched, if the user and pass are in the db
            if (user.length > 0) {
                user = await models.Usuario.find(
                    { usuario: usu, password: pass },
                    { token: 0, password: 0 })
                // if the user exist and them pass its correct, it's generated the token 
                if (user.length > 0) token = await jwt.sign({ expiresIn: "30d" }, con.conf.key)
                else {
                    throw "La contraseña es incorrecta."
                }
            } else throw "El usuario no existe."
            user[0].token = token
            return user[0]
        })
    },
    getMenuData: async (req, res) => {
        debugReq(req)

        let permiso = req.body.permiso

        await transaction(req, res, async (session) => {
            let arrayMen = await models.Permiso.aggregate([
                {
                    $match: {
                        _id: ObjectId(permiso)
                    }
                },
                {
                    $lookup: {
                        from: 'menu',
                        localField: 'menuOptions',
                        foreignField: "_id",
                        as: 'menu'
                    }
                },
                {
                    $project: {
                        "menuOptions": 0,
                        "_id": 0
                    }
                }
            ]).exec()
            return arrayMen
        })
    },
    newUser: async (req, res) => {
        debugReq(req)
        let dataSet = req.body
        await transaction(req, res, async (session) => {
            //It's created the new usuer 
            let usuario = new models.Usuario()
            Object.keys(dataSet).forEach((key) => usuario[key] = dataSet[key])
            usuario.save()
            session.commitTransaction()
            return "Usuario creado con exito."
        })
    },
    getProductList: async (req, res) => {
        debugReq(req)

        let id = req.body.prod_id
        let busqueda = req.body.busqueda
        let init = req.body.init
        let last = req.body.last
        let color = []
        let categoria = []
        let tag = []
        let talla = []
        let params = []

        try { color = JSON.parse(req.body.col).map((id) => ObjectId(id)) } catch (e) { }
        try { categoria = JSON.parse(req.body.cat).map((id) => ObjectId(id)) } catch (e) { }
        try { tag = JSON.parse(req.body.tag).map((id) => ObjectId(id)) } catch (e) { }
        try { talla = JSON.parse(req.body.tal).map((id) => ObjectId(id)) } catch (e) { }

        if (color.length) params.push({ $match: { 'combinacion.color': { $in: color } } })
        if (categoria.length) params.push({ $match: { categoria: { $in: categoria } } })
        if (talla.length) params.push({ $match: { 'combinacion.talla': { $in: talla } } })
        if (tag.length) params.push({ $match: { tag: { $in: tag } } })
        params.push({
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

        await transaction(req, res, async (session) => {
            let arrayProds = await models.Producto.aggregate(params).exec()
            arrayProds = arrayProds.slice(parseInt(init), parseInt(last))
            return arrayProds
        })
    },
    getColor: async (req, res) => {
        debugReq(req)

        await transaction(req, res, async (session) => {
            let arrayColors = await models.Color.find()
            return arrayColors
        })

    },
    getTalla: async (req, res) => {
        debugReq(req)

        await transaction(req, res, async (session) => {
            let arrayTallas = await models.Talla.find()
            return arrayTallas
        })

    },
    addNewCombi: async (req, res) => {


        await transaction(req, res, async (session) => {
            let auxCombi = new models.Combinacion()
            auxCombi.talla = ObjectId(req.body.talla)
            auxCombi.color = ObjectId(req.body.color)
            let stockAux = typeof req.body.stock == 'string' ? parseInt(req.body.stock) : req.body.stock
            auxCombi.stock = stockAux
            auxCombi.img =req.body.img

            await Producto.updateOne({ _id: ObjectId(req.body.idProd) }, {
                $push: {
                    combinacion: auxCombi
                }
            })
            session.commitTransaction()
            return "Combinación añadida con exito."
        })
    }
}