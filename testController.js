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
            return  user[0]
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
                        from:'menu',
                        localField:'menuOptions',
                        foreignField:"_id",
                        as:'menu'
                    }
                },
                {
                    $project:{
                        "menuOptions":0,
                        "_id":0
                    }
                }
            ]). exec()

            console.log("Agregate",arrayMen)
            return arrayMen
        })
    }
}