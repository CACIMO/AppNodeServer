let models = require('./models')
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
            if(err)res.json({
                message: 'Error',
                data:err
            })
            else res.json({
                message: 'New contact created!',
                data:data
            })
        })

        
    }
}