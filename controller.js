let models = require('./models')
let con = require('./config')
let jwt = require('jsonwebtoken')
module.exports ={
    nuevoUsuario:(req, res)=>{
        let User = new models.Usuario()
        User.usuario = req.body.usuario
        User.cedula = req.body.cedula
        User.nombre = req.body.nombre
        User.apellido = req.body.apellido
        User.correo = req.body.correo
        User.telefono = req.body.telefono
        User.password = req.body.password
        
        User.save((err,data)=>{
            if(err)res.status(400).json({
                err:err,
                data:data||null
            })
            else res.status(200).json({
                err:err,
                data:data
            })
        }) 
    },
    makeToken :(req, res)=>{
        jwt.sign({expiresIn:"30d"},con.conf.key,(err,tk)=>{
            if(err)res.status(400).json({
                err:err,
                data:data||null
            })
            else res.status(200).json({
                err:err,
                data:tk
            })
        })

    },
    logIn:(req, res)=>{
        let token = req.headers['access-token']
        
        if(token){
            jwt.verify(token, con.conf.key, (err, decoded)=> {
                if(err)res.status(400).json({
                    err:err,
                    data:data||null
                })
                else res.status(200).json({
                    err:err,
                    data:decoded
                })
               /// console.log(decoded) // bar
              });
        }

    }
}