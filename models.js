const { ObjectId, ObjectID } = require('bson');
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
    fecha: {
        type: Date,
        default: new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }),
        //required: true
    },
    refVendedora: {
        type: String,
        required: true
    },
    refInterna: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },

    valor: {
        type: Number,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    img: {
        type: Buffer,
        required: true
    },
    pesoImg: {
        type: Number,
        required: true

    },
    tag: {
        type: Array
    },
    color: {
        type: Array
    },
    categoria: {
        type: Array
    },
    talla: {
        type: Array
    }

});
let TagSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },

    active: {
        type: Boolean,
        required: true
    }
});
let TallaSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },

    active: {
        type: Boolean,
        required: true
    }
});
let ColorSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    primario: {
        type: String,
        required: true
    },
    segundario: {
        type: String,
    },
    active: {
        type: Boolean,
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
let CarritoSchema = mongoose.Schema({
    formato:{
        type: String,
        required: true

    },
    producto: {
        type: Array,
        required: true
    },
    active: {
        type: bool,
        required: true
    }
});
let CarritoItemSchema = mongoose.Schema({
    id: {
        type: ObjectId,
        required: true
    },
    valor:{
        type: String,
        required: true

    },
    color: {
        type: ObjectId,
        required: true
    },
    talla: {
        type: ObjectId,
        required: true
    }
});

// Export Contact model
module.exports = {
    Usuario: mongoose.model('usuario', usuarioSchema),
    Producto: mongoose.model('producto', ProductoSchema),
    Tag: mongoose.model('tag', TagSchema),
    Color: mongoose.model('color', ColorSchema),
    Talla: mongoose.model('talla', TallaSchema),
    Carrito: mongoose.model('carrito', CarritoSchema),
    CarritoItem: mongoose.model('carritoItem', CarritoItemSchema),
    Categoria: mongoose.model('categoria', CategoriaSchema)
}
