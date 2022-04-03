let models = require('./models')
let con = require('./config')
let qrCode = require('qrcode')
let jwt = require('jsonwebtoken')
let fs = require('fs')
let spawn = require("child_process").spawn;
module.exports = {
    logIn: async (req, res) => {
        debugReq(req)
        
        let usu = req.body.usuario
        let pass = req.body.password

        //it's searched, if the user are in the db

        let user = await models.Usuario.find({usuario:usu})
        res.status(400)




        /* models.Usuario.find(
            { usuario: usu, password: pass }, 
            { token: 0, password: 0 }).exec((err, data) => {
                
                if (err) res.status(400).json({
                    err: err })
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

        }) */
    }
}

function debugReq(req){
    if(con.conf.debugMode){
        console.log("########## -- ENCABEZADOS -- ##########")
        console.log(req.headers)
        console.log("########## -- QUERY PARAMS -- ##########")
        console.log(req.params)
        console.log("########## -- BODY  REQUEST -- ##########")
        console.log(req.body)
    }
}

function errorDTO(req,error,msg){

    console.log("########## -- ENCABEZADOS -- ##########")
    console.log(req.headers)
    console.log("########## -- QUERY PARAMS -- ##########")
    console.log(req.params)
    console.log("########## -- BODY  REQUEST -- ##########")
    console.log(req.body)
    console.log("########## -- THE ERROR -- ##########")
    console.log(error)

    return{
        successful:false,
        error:error,
        message:msg
    }
}
function successfulDTO(data,msg){ 
    return{
        successful:true,
        data:[data],
        message:msg
    }
}
async function transaction(execute){
    const session = await models.conn.startSession();
    try{
        const session = await models.conn.startSession();
        await session.withTransaction(async () => execute(sesion))

    }catch{
        console.log("Transaccion Finalizada con errores.")
    }
    session.endSession();
}