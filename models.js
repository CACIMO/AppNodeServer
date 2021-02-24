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
let ProductoSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    },
});
let TagSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    
    active: {
        type: Number,
        required: true
    }
});
let ColorSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    active: {
        type: Number,
        required: true
    }
});
let CategoriaSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
});
// Export Contact model
module.exports = {
    Usuario: mongoose.model('usuario', usuarioSchema),
    Producto: mongoose.model('producto', ProductoSchema),
    Tag: mongoose.model('tag', TagSchema),
    Color: mongoose.model('color', ColorSchema),
    Categoria: mongoose.model('categoria', CategoriaSchema)
}
