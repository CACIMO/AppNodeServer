let mongoose = require('mongoose');
mongoose.pluralize(null);
let usuarioSchema = mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    cedula: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Export Contact model
module.exports = { 
    Usuario: mongoose.model('usuario', usuarioSchema) 
}
