let models = require('./models')
let con = require('./config')
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
    makeToken :(jwt)=>{
        jwt.sign({expiresIn:"1s"},con.conf.key,(err,tk)=>{
            if(err)console.log('err')
            else console.log(tk)
        })

    }
}