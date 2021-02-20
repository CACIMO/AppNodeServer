let models = require('./models')
module.exports ={
    nuevoUsuario:(req, res)=>{
        console.log(req.body)
        res.json({
            message: 'New contact created!'
        });
    }
}